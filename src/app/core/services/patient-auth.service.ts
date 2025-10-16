import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  AuthPatientLogin,
  AuthPatientRequest,
  AuthPatientResponse,
} from '../../models/auth-patient-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientAuthService {
  private http = inject(HttpClient);
  private apiUrlForRegistration = environment.apiUrl + environment.auth.register;
  private apiUrlForLogin = environment.apiUrl + environment.auth.login;
  private tokenKey = 'token';
  private patientKey = 'patientData';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  register(registerRequest: AuthPatientRequest): Observable<any> {
    return this.http
      .post<AuthPatientResponse>(`${this.apiUrlForRegistration}`, registerRequest, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap((response) => {
          this.setRegisteredPatient(response);
          // this.isAuthenticatedSubject.next(true);
        })
      );
  }

  login(loginRequest: AuthPatientLogin): Observable<AuthPatientResponse> {
    return this.http.post<AuthPatientResponse>(`${this.apiUrlForLogin}`, loginRequest).pipe(
      tap((response) => {
        this.setAuthData(response);
        // this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.patientKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentPatient(): AuthPatientResponse | null {
    const patientData = localStorage.getItem(this.patientKey);
    return patientData ? (JSON.parse(patientData) as AuthPatientResponse) : null;
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private setRegisteredPatient(data: AuthPatientResponse): void {
    localStorage.setItem(this.patientKey, JSON.stringify(data));
    this.isAuthenticatedSubject.next(true);
  }

  private setAuthData(response: AuthPatientResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.patientKey, JSON.stringify(response));
    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
