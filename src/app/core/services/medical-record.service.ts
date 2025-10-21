import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Removed 'of' and 'catchError'
import { MedicalRecordResponseDTO } from '../../models/medicalrecord-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {
  private baseUrl = environment.apiUrl;
  // private useMockData = false; // Removed mock flag

  constructor(private http: HttpClient) {}

  getRecordsForPatient(): Observable<MedicalRecordResponseDTO[]> {
    return this.http.get<MedicalRecordResponseDTO[]>(`${this.baseUrl}/patients/me/medical-records`);
  }
}
