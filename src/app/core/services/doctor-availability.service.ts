// src/app/services/doctor-availability.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AvailabilitySlot } from '../../models/availabilityslot-interface';

@Injectable({
  providedIn: 'root', // Makes the service a singleton available everywhere
})
export class DoctorAvailabilityService {
  // Base URL for your Spring Boot API (adjust this)
  private apiUrl = 'http://localhost:8080/api/doctor/availability';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all recurring availability slots for the logged-in doctor.
   * Assumes the backend handles doctor identification via JWT/Session.
   */
  getScheduledSlots(): Observable<AvailabilitySlot[]> {
    return this.http.get<AvailabilitySlot[]>(this.apiUrl);
  }

  /**
   * Saves a new recurring availability slot to the backend.
   * @param slot The new slot data to save.
   */
  saveNewSlot(slot: AvailabilitySlot): Observable<AvailabilitySlot> {
    // Spring Boot typically returns the saved entity with a generated ID
    return this.http.post<AvailabilitySlot>(this.apiUrl, slot);
  }

  /**
   * Updates an existing availability slot.
   * @param slot The updated slot data.
   */
  updateSlot(slot: AvailabilitySlot): Observable<AvailabilitySlot> {
    const url = `${this.apiUrl}/${slot.id}`;
    return this.http.put<AvailabilitySlot>(url, slot);
  }

  /**
   * Deletes a specific availability slot by ID.
   * @param id The ID of the slot to delete.
   */
  deleteSlot(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
