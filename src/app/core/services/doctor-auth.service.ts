import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuthDoctorLogin,
  AuthDoctorRequest,
  AuthDoctorResponse,
} from '../../models/auth-doctor-interface';
import { Router } from '@angular/router';
import { redirectBasedOnRole } from '../../models/redirectBasedOnRole';

@Injectable({
  providedIn: 'root',
})
export class DoctorAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  // === CONFIGURATION (UPDATED for Doctor) ===
  private apiUrlForRegistration = environment.apiUrl + environment.admin.doctorRegister;
  private apiUrlForLogin = environment.apiUrl + environment.admin.doctorLogin;

  // Separate keys to prevent token collision with Patient/Admin tokens
  private tokenKey = 'authDoctorToken';
  private doctorKey = 'doctorData';
  private userRoleKey = 'userRole';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string>(this.getUserRole());
  // --- PUBLIC METHODS ---

  register(registerRequest: AuthDoctorRequest): Observable<AuthDoctorResponse> {
    return this.http
      .post<AuthDoctorResponse>(`${this.apiUrlForRegistration}`, registerRequest, {
        // Ensure this responseType is correct based on your backend implementation
        responseType: 'text' as 'json',
      })
      .pipe(
        tap((response) => {
          this.setRegisteredDoctor(response, 'DOCTOR');
        })
      );
  }

  login(loginRequest: AuthDoctorLogin): Observable<AuthDoctorResponse> {
    return this.http.post<AuthDoctorResponse>(`${this.apiUrlForLogin}`, loginRequest).pipe(
      tap((response) => {
        const role = 'DOCTOR';
        this.setAuthData(response, role);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.doctorKey);
    localStorage.removeItem(this.userRoleKey);
    this.userRoleSubject.next('');
    this.router.navigate(['/auth/login']);
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

  getUserRole(): string {
    return localStorage.getItem(this.userRoleKey) || '';
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }

  // --- PRIVATE/HELPER METHODS ---

  private setRegisteredDoctor(data: AuthDoctorResponse, role: string): void {
    localStorage.setItem(this.doctorKey, JSON.stringify(data));
    localStorage.setItem(this.userRoleKey, role);
    this.isAuthenticatedSubject.next(true);
  }

  private setAuthData(response: AuthDoctorResponse, role: string): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userRoleKey, role);
    localStorage.setItem(this.doctorKey, JSON.stringify(response));
    this.userRoleSubject.next(role);
    this.isAuthenticatedSubject.next(true);
    redirectBasedOnRole(this.router, role);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  canAccess(requiredRole: string): boolean {
    const userRole = this.getUserRole();
    return userRole === requiredRole;
  }
}
