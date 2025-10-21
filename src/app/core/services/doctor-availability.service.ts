import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AvailabilitySlot } from '../../models/availabilityslot-interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorAvailabilityService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getScheduledSlots(): Observable<AvailabilitySlot[]> {
    return this.http
      .get<AvailabilitySlot[]>(`${this.baseUrl}${environment.doctor.getAvailability}`)
      .pipe(catchError(() => of(this.getMockSlots())));
  }

  saveNewSlot(slot: AvailabilitySlot): Observable<AvailabilitySlot> {
    return this.http.post<AvailabilitySlot>(
      `${this.baseUrl}${environment.doctor.addAvailability}`,
      slot
    );
  }

  updateSlot(slot: AvailabilitySlot): Observable<AvailabilitySlot> {
    const url = `${this.baseUrl}${environment.doctor.updateAvailability}`
      .replace('{doctorId}', 'me')
      .replace('{availabilityId}', slot.id.toString());
    return this.http.put<AvailabilitySlot>(url, slot);
  }

  deleteSlot(id: number): Observable<void> {
    const url = `${this.baseUrl}${environment.doctor.updateAvailability}`
      .replace('{doctorId}', 'me')
      .replace('{availabilityId}', id.toString());
    return this.http.delete<void>(url);
  }

  private getMockSlots(): AvailabilitySlot[] {
    return [
      { id: 1, day: 'MONDAY', startTime: '09:00', endTime: '17:00', duration: 30 },
      { id: 2, day: 'TUESDAY', startTime: '09:00', endTime: '17:00', duration: 30 },
      { id: 3, day: 'WEDNESDAY', startTime: '09:00', endTime: '17:00', duration: 30 },
      { id: 4, day: 'THURSDAY', startTime: '09:00', endTime: '17:00', duration: 30 },
      { id: 5, day: 'FRIDAY', startTime: '09:00', endTime: '17:00', duration: 30 },
    ];
  }
}
