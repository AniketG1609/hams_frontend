import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  AuthPatientLogin,
  AuthPatientRequest,
  AuthPatientResponse,
} from '../../models/auth-patient-interface';
import { environment } from '../../environments/environment';
import { redirectBasedOnRole } from '../../models/redirectBasedOnRole';

@Injectable({
  providedIn: 'root',
})
export class PatientAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrlForRegistration = environment.apiUrl + environment.auth.register;
  private apiUrlForLogin = environment.apiUrl + environment.auth.login;
  private tokenKey = 'authPatientToken';
  private patientKey = 'patientData';
  private userRoleKey = 'userRole';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string>(this.getUserRole());

  register(registerRequest: AuthPatientRequest): Observable<any> {
    return this.http
      .post<AuthPatientResponse>(`${this.apiUrlForRegistration}`, registerRequest, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap((response) => {
          this.setRegisteredPatient(response, 'PATIENT');
          // this.isAuthenticatedSubject.next(true);
        })
      );
  }

  login(loginRequest: AuthPatientLogin): Observable<AuthPatientResponse> {
    return this.http.post<AuthPatientResponse>(`${this.apiUrlForLogin}`, loginRequest).pipe(
      tap((response) => {
        const role = 'PATIENT';
        this.setAuthData(response, role);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.patientKey);
    localStorage.removeItem(this.userRoleKey);
    this.userRoleSubject.next('');
    this.router.navigate(['/auth/login']);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentPatient(): AuthPatientResponse | null {
    const patientData = localStorage.getItem(this.patientKey);
    return patientData ? (JSON.parse(patientData) as AuthPatientResponse) : null;
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

  private setRegisteredPatient(data: AuthPatientResponse, role: string): void {
    localStorage.setItem(this.patientKey, JSON.stringify(data));
    localStorage.setItem(this.userRoleKey, role);
    this.isAuthenticatedSubject.next(true);
  }

  private setAuthData(response: AuthPatientResponse, role: string): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userRoleKey, role);
    localStorage.setItem(this.patientKey, JSON.stringify(response));

    this.isAuthenticatedSubject.next(true);
    this.userRoleSubject.next(role);
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
