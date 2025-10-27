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

  getPatients(): Observable<PatientResponseDTO[]> {
    return this.http.get<PatientResponseDTO[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching patients:', error);
        return of([]);
      })
    );
  }

  getPatientById(patientId: number): Observable<PatientResponseDTO> {
    return this.http.get<PatientResponseDTO>(`${this.apiUrl}/${patientId}`);
  }

  getPatientMedicalRecords(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${patientId}/medical-records`);
  }

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
}
