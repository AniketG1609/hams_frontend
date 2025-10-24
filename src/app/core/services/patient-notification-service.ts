import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Removed 'of' and 'catchError'
import { NotificationResponseDTO } from '../../models/notification-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = environment.apiUrl;
  // private useMockData = false; // Removed mock flag

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of notifications for the currently authenticated patient.
   * @returns An Observable of NotificationResponseDTO array.
   */
  getPatientNotifications(): Observable<NotificationResponseDTO[]> {
    return this.http.get<NotificationResponseDTO[]>(`${this.baseUrl}/patients/me/notifications`);
  }

  // getDoctorNotifications(): Observable<NotificationResponseDTO[]> {
  //   return this.http.get<NotificationResponseDTO[]>(`${this.baseUrl}/doctors/me/notifications`);
  // }

  /**
   * Marks a single notification as read.
   * @param notificationId The ID of the notification to mark as read.
   * @returns An Observable of void.
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  /**
   * Marks all patient notifications as read.
   * @returns An Observable of void.
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notifications/read-all`, {});
  }

  getUnreadNotificationCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notifications/count`);
  }
}
