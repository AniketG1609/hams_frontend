import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrlForLogin = environment.apiUrl + environment.admin.adminLogin;
  private tokenKey = 'authAdminToken';
  private adminKey = 'adminData';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  login(loginRequest: AuthAdminLogin): Observable<AuthAdminResponse> {
    return this.http.post<AuthAdminResponse>(`${this.apiUrlForLogin}`, loginRequest).pipe(
      tap((response) => {
        this.setAuthData(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.adminKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentAdmin(): AuthAdminResponse | null {
    const adminData = localStorage.getItem(this.adminKey);
    return adminData ? (JSON.parse(adminData) as AuthAdminResponse) : null;
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private setAuthData(response: AuthAdminResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.adminKey, JSON.stringify(response));
    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
