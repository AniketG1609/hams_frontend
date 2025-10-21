import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PatientResponseDTO } from '../../models/appointment-interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorPatientService {
  private http = inject(HttpClient);
  // Assuming the Doctor's own patient list API is at this endpoint
  private apiUrl = `${environment.apiUrl}/doctors/me/patients`;

  /**
   * Fetches all patients associated with the logged-in doctor.
   * Returns an empty array on error, relying entirely on the backend.
   */
  getPatients(): Observable<PatientResponseDTO[]> {
    return this.http.get<PatientResponseDTO[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching patients:', error);
        // Removed mock data: now returns an empty array on error.
        return of([]);
      })
    );
  }

  /**
   * Fetches a specific patient by ID.
   */
  getPatientById(patientId: number): Observable<PatientResponseDTO> {
    // Note: No error handling here; errors should be handled by the component.
    return this.http.get<PatientResponseDTO>(`${this.apiUrl}/${patientId}`);
  }

  /**
   * Fetches medical records for a specific patient.
   */
  getPatientMedicalRecords(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${patientId}/medical-records`);
  }

  /**
   * Searches patients by filtering the full list fetched from the backend.
   * This is a client-side search. If the API supports server-side searching,
   * this method should be updated to call an API endpoint with a search query.
   */
  searchPatients(searchTerm: string): Observable<PatientResponseDTO[]> {
    return this.getPatients().pipe(
      map((patients) =>
        patients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  // The private getMockPatients() method has been removed.
}
