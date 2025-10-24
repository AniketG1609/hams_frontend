import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js';
import { Doctor } from '../../models/auth-doctor-interface.js';
import { DoctorResponseDTO } from '../../models/doctor-interface.js';
// 🔑 Import the Doctor interface directly

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  logout() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  // 🔑 Updated method signature to return Observable<Doctor>
  getLoggedInDoctorProfile(): Observable<DoctorResponseDTO> {
    // Calls the backend endpoint /api/doctors/me
    // NOTE: We assume the backend /api/doctors/me returns the Doctor entity/DTO directly,
    // NOT the full AuthDoctorResponse (token, type, patient/doctor).
    return this.http.get<DoctorResponseDTO>(`${this.apiUrl}/me`);
  }
}
