import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Removed 'of' and 'catchError'
import { Patient, PatientDTO } from '../../models/patient-interface';
import { DoctorResponseDTO } from '../../models/doctor-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = environment.apiUrl + '/patients';
  // Removed private useMockData = false;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the details of the currently authenticated patient.
   * API: GET /api/patients/me
   * @returns An Observable of the Patient object.
   */
  getPatient(): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/me`);
  }

  /**
   * Updates the details of the currently authenticated patient.
   * API: PATCH /api/patients/me
   * @param patientDTO The patient data transfer object with updates.
   * @returns An Observable of the updated Patient object.
   */
  updatePatient(patientDTO: PatientDTO): Observable<Patient> {
    return this.http.patch<Patient>(`${this.baseUrl}/me`, patientDTO);
  }

  /**
   * Searches for doctors by name.
   * API: GET /api/patients/doctor-name?name={name}
   * @param name The name fragment to search for.
   * @returns An Observable of DoctorResponseDTO array.
   */
  searchDoctorByName(name: string): Observable<DoctorResponseDTO[]> {
    return this.http.get<DoctorResponseDTO[]>(`${this.baseUrl}/doctor-name?name=${name}`);
  }

  /**
   * Searches for doctors by specialization.
   * API: GET /api/patients/doctor-specialization?specialization={specialization}
   * @param specialization The specialization fragment to search for.
   * @returns An Observable of DoctorResponseDTO array.
   */
  searchDoctorBySpecialization(specialization: string): Observable<DoctorResponseDTO[]> {
    return this.http.get<DoctorResponseDTO[]>(
      `${this.baseUrl}/doctor-specialization?specialization=${specialization}`
    );
  }

  /**
   * Fetches all doctors in the system.
   * API: GET /api/patients/all-doctors
   * @returns An Observable of all DoctorResponseDTO array.
   */
  getAllDoctors(): Observable<DoctorResponseDTO[]> {
    return this.http.get<DoctorResponseDTO[]>(`${this.baseUrl}/all-doctors`);
  }

  // Removed private getMockPatient() method
  // Removed private getMockDoctors() method
}
