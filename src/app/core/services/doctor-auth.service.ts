import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuthDoctorLogin,
  AuthDoctorRequest,
  AuthDoctorResponse,
} from '../../models/auth-doctor-interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorAuthService {
  private http = inject(HttpClient);

  // === CONFIGURATION (UPDATED for Doctor) ===
  private apiUrlForRegistration = environment.apiUrl + environment.admin.doctorRegister;
  private apiUrlForLogin = environment.apiUrl + environment.admin.doctorLogin;

  // Separate keys to prevent token collision with Patient/Admin tokens
  private tokenKey = 'authDoctorToken';
  private doctorKey = 'doctorData';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  // --- PUBLIC METHODS ---

  register(registerRequest: AuthDoctorRequest): Observable<AuthDoctorResponse> {
    return this.http
      .post<AuthDoctorResponse>(`${this.apiUrlForRegistration}`, registerRequest, {
        // Ensure this responseType is correct based on your backend implementation
        responseType: 'text' as 'json',
      })
      .pipe(
        tap((response) => {
          this.setRegisteredDoctor(response);
        })
      );
  }

  login(loginRequest: AuthDoctorLogin): Observable<AuthDoctorResponse> {
    return this.http.post<AuthDoctorResponse>(`${this.apiUrlForLogin}`, loginRequest).pipe(
      tap((response) => {
        this.setAuthData(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.doctorKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Retrieves the full doctor data object from local storage.
   */
  getCurrentDoctor(): AuthDoctorResponse | null {
    const doctorData = localStorage.getItem(this.doctorKey);
    return doctorData ? (JSON.parse(doctorData) as AuthDoctorResponse) : null;
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // --- PRIVATE/HELPER METHODS ---

  private setRegisteredDoctor(data: AuthDoctorResponse): void {
    localStorage.setItem(this.doctorKey, JSON.stringify(data));
    this.isAuthenticatedSubject.next(true);
  }

  private setAuthData(response: AuthDoctorResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.doctorKey, JSON.stringify(response));
    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
