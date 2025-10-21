// src/app/core/services/appointment.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js';
import { Appointment } from '../../models/doctor-appointment-interface.js';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private doctorAppointmentsUrl = `${this.apiUrl}/doctors/appointments`;

  // constructor(private http: HttpClient) { }

  getDoctorAppointments(status: string = 'all'): Observable<Appointment[]> {
    let params = new HttpParams();
    if (status !== 'all') {
      // Backend expects uppercase enum value (e.g., PENDING, CONFIRMED)
      params = params.set('status', status.toUpperCase());
    }
    return this.http.get<Appointment[]>(this.doctorAppointmentsUrl, { params });
  }

  getTodayAppointmentCount(): Observable<number> {
    // Assuming this count is for a general dashboard stat
    return this.http.get<number>(`${this.apiUrl}/appointments/today-count`);
  }

  // 🔑 1. Method for Total Patients (Uses the base /api path)
  getTotalPatientCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/dashboard/patient-count`);
  }

  // 🔑 2. Method for Pending Reviews (Uses the doctor-specific /api/doctors/dashboard path)
  getPendingReviewsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/doctors/dashboard/pending-reviews/count`);
  }

  // 🔑 3. Method for Today's Appointments for Doctor
  getTodayAppointmentsForDoctor(): Observable<Appointment[]> {
    // Specific method for today's appointments
    return this.http.get<Appointment[]>(`${this.doctorAppointmentsUrl}/today`);
  }

  // 🔑 Confirm Appointment (POST /doctors/appointments/{id}/confirm)
  confirmAppointment(appointmentId: number): Observable<any> {
    // Assuming backend uses POST with an empty body
    return this.http.post(`${this.doctorAppointmentsUrl}/${appointmentId}/confirm`, {});
  }

  // 🔑 5. Reject Appointment
  rejectAppointment(appointmentId: number, reason?: string): Observable<any> {
    const body = reason ? { reason } : {}; // Send reason in the body
    return this.http.post(`${this.doctorAppointmentsUrl}/${appointmentId}/reject`, body);
  }

  saveConsultationNotes(appointmentId: number, notesPayload: any): Observable<any> {
    // notesPayload: { diagnosis: string, symptoms: string, notes: string, prescription: string }
    return this.http.post(
      `${this.doctorAppointmentsUrl}/${appointmentId}/consultation`,
      notesPayload
    );
  }
}
