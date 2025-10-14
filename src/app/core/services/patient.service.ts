import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Patient } from '../../models/patient-interface'; // Assuming this interface is available

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  // Spring Boot REST API Endpoint
  private apiUrl = 'http://localhost:8080/api/patients';

  // BehaviorSubject holds and streams the current state of all patients
  private allPatientsSubject = new BehaviorSubject<Patient[]>([]);
  public allPatients$: Observable<Patient[]> = this.allPatientsSubject.asObservable();

  // The loading state can be useful for showing spinners in the UI
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  // Error message subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    // Start fetching data immediately upon service instantiation
    this.fetchInitialPatients();
  }

  /**
   * Performs the HTTP GET request to the Spring Boot backend.
   */
  public fetchInitialPatients(): void {
    this.isLoadingSubject.next(true); // Start loading
    this.errorSubject.next(null); // Clear previous errors

    this.http
      .get<Patient[]>(this.apiUrl)
      .pipe(
        tap((patients) => {
          console.log(`[PatientService] Successfully fetched ${patients.length} patients.`);
          this.isLoadingSubject.next(false); // Stop loading on success
        }),
        catchError((error) => {
          console.error('[PatientService] Error fetching patients from backend:', error);
          // Set error message and stop loading
          this.errorSubject.next(
            'Failed to connect to the patient data API. Please ensure the backend is running and CORS is configured.'
          );
          this.isLoadingSubject.next(false);
          // Clear current state and throw error so consuming component can react if needed
          this.allPatientsSubject.next([]);
          return throwError(() => new Error('API fetch failed.'));
        })
      )
      .subscribe((patients) => {
        // Update the stream with the fetched data
        this.allPatientsSubject.next(patients);
      });
  }

  // --- Core Data/Logic Methods ---

  /**
   * Returns the current, synchronously available list of patients from the stream.
   */
  public getPatients(): Patient[] {
    return this.allPatientsSubject.getValue();
  }

  /**
   * Performs filtering and sorting based on criteria passed from the component.
   * Logic remains here, operating on the currently available data.
   */
  public filterAndSortPatients(
    searchTerm: string,
    genderFilter: string,
    ageFilter: string,
    sortFilter: string
  ): Patient[] {
    let tempPatients = [...this.getPatients()];
    const search = searchTerm.toLowerCase();

    // 1. FILTERING
    tempPatients = tempPatients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(search) ||
        patient.email.toLowerCase().includes(search) ||
        patient.phone.includes(search);

      const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;

      let matchesAge = true;
      if (ageFilter !== 'all') {
        const age = patient.age;
        if (ageFilter === '0-18') matchesAge = age >= 0 && age <= 18;
        else if (ageFilter === '19-35') matchesAge = age >= 19 && age <= 35;
        else if (ageFilter === '36-60') matchesAge = age >= 36 && age <= 60;
        else if (ageFilter === '60+') matchesAge = age > 60;
      }
      return matchesSearch && matchesGender && matchesAge;
    });

    // 2. SORTING (in-memory sort)
    tempPatients.sort((a, b) => {
      switch (sortFilter) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return b.age - a.age;
        case 'visits':
          return b.totalVisits - a.totalVisits;
        case 'lastVisit':
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return 0;
      }
    });

    return tempPatients;
  }

  // --- Utility/Helper Methods (stay in service) ---

  private getToday() {
    return new Date();
  }

  /**
   * Calculates all dashboard statistics.
   */
  public calculateStats(patients: Patient[]): {
    totalCount: number;
    newCount: number;
    activeCount: number;
    followupCount: number;
  } {
    const today = this.getToday();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const totalCount = patients.length;

    const newCount = patients.filter((p) => {
      const regDate = new Date(p.registrationDate);
      return regDate.getMonth() === thisMonth && regDate.getFullYear() === thisYear;
    }).length;

    const activeCount = patients.reduce((sum, p) => sum + p.activeTreatments, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const followupCount = patients.filter((p) => {
      const lastVisit = new Date(p.lastVisit);
      return lastVisit < thirtyDaysAgo && p.activeTreatments > 0;
    }).length;

    return { totalCount, newCount, activeCount, followupCount };
  }
}
