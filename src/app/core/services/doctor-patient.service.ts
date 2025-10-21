import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PatientResponseDTO } from '../../models/appointment-interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorPatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/doctors/me/patients`;

  getPatients(): Observable<PatientResponseDTO[]> {
    return this.http.get<PatientResponseDTO[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching patients:', error);
        return of(this.getMockPatients());
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

  private getMockPatients(): PatientResponseDTO[] {
    return [
      {
        patientId: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        contactNumber: '+1-555-0123',
        address: '123 Main St, City, State',
        gender: 'Male',
        dateOfBirth: '1989-03-15',
        bloodGroup: 'O+',
      },
      {
        patientId: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        contactNumber: '+1-555-0124',
        address: '456 Oak Ave, City, State',
        gender: 'Female',
        dateOfBirth: '1992-07-22',
        bloodGroup: 'A+',
      },
      {
        patientId: 3,
        name: 'Robert Johnson',
        email: 'robert.j@email.com',
        contactNumber: '+1-555-0125',
        address: '789 Pine Rd, City, State',
        gender: 'Male',
        dateOfBirth: '1975-11-30',
        bloodGroup: 'B+',
      },
    ];
  }
}
