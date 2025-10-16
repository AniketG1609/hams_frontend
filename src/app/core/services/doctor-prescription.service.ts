// src/app/services/doctor-prescription.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, Prescription } from '../../models/prescription-interface';
// import { Prescription, Patient } from '../models/prescription-interface'; // Adjust path
// import { environment } from 'src/environments/environment'; // Assuming environment file

@Injectable({
  providedIn: 'root',
})
export class DoctorPrescriptionService {
  private apiUrl = `localhost:8080/api/v1/doctor/prescriptions`;
  private patientApiUrl = `$localhost:8080/api/v1/doctor/patients/list`; // Simplified patient list endpoint

  constructor(private http: HttpClient) {}

  /**
   * Fetches the full prescription history for the doctor.
   */
  getPrescriptionHistory(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.apiUrl);
  }

  /**
   * Fetches a simplified list of patients for the dropdown selector.
   */
  getPatientList(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientApiUrl);
  }

  /**
   * Creates a new prescription (can be a draft or sent).
   */
  createPrescription(prescription: Partial<Prescription>): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, prescription);
  }

  /**
   * Updates an existing prescription (used for editing drafts or updating status).
   */
  updatePrescription(prescription: Prescription): Observable<Prescription> {
    const url = `${this.apiUrl}/${prescription.id}`;
    return this.http.put<Prescription>(url, prescription);
  }

  /**
   * Deletes a prescription (typically only drafts).
   */
  deletePrescription(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
