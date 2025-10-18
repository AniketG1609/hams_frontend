import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { redirectBasedOnRole } from '../../models/redirectBasedOnRole';

export interface Admin {
  adminId: number;
  username: string;
  role: string;
}

export interface AuthAdminLogin {
  username: string;
  password: string;
}

export interface AuthAdminResponse {
  token: string;
  type: 'Bearer';
  admin: Admin; // Full Admin object
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrlForLogin = environment.apiUrl + environment.admin.adminLogin;
  private tokenKey = 'authAdminToken';
  private adminKey = 'adminData';
  private userRoleKey = 'userRole';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string>(this.getUserRole());

  login(loginRequest: AuthAdminLogin): Observable<AuthAdminResponse> {
    return this.http.post<AuthAdminResponse>(`${this.apiUrlForLogin}`, loginRequest).pipe(
      tap((response) => {
        const role = 'ADMIN';
        this.setAuthData(response, role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
    localStorage.removeItem(this.userRoleKey);
    this.userRoleSubject.next('');
    this.router.navigate(['/auth/login']);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentAdmin(): AuthAdminResponse | null {
    const adminData = localStorage.getItem(this.adminKey);
    return adminData ? (JSON.parse(adminData) as AuthAdminResponse) : null;
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

  private setAuthData(response: AuthAdminResponse, role: string): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.adminKey, JSON.stringify(response));
    localStorage.setItem(this.userRoleKey, role);

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
