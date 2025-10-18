import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientAuthService } from '../../../core/services/patient-auth.service';
import { AuthPatientLogin } from '../../../models/auth-patient-interface';
import { Observable } from 'rxjs';
import { DoctorAuthService } from '../../../core/services/doctor-auth.service';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { AuthDoctorLogin } from '../../../models/auth-doctor-interface';

type LoginMode = 'patient' | 'doctor' | 'admin'; // Add other modes as needed

@Component({
  selector: 'app-login',
  standalone: true, // Assuming standalone for modern Angular
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [ReactiveFormsModule, CommonModule, RouterLink], // Modules required by the template
})
export class Login {
  private fb = inject(FormBuilder);
  private patientAuthService = inject(PatientAuthService);
  private doctorAuthService = inject(DoctorAuthService);
  private adminAuthService = inject(AdminAuthService); // Replace with actual AdminAuthService when available
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false; // State for password visibility
  returnUrl: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      // Mapping 'Email Address' field in HTML to 'username' form control
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Get return url from route parameters or default to patient dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/patient/dashboard';

    // If already authenticated, redirect to returnUrl
    if (this.getAuthenticatedRole() !== null) {
      this.redirectAuthenticatedUser();
    }
  }

  private getAuthenticatedRole(): string | null {
    if (this.patientAuthService.getToken()) {
      return 'PATIENT';
    }
    if (this.doctorAuthService.getToken()) {
      return 'DOCTOR';
    }
    if (this.adminAuthService.getToken()) {
      return 'ADMIN';
    }
    return null;
  }

  private redirectAuthenticatedUser(): void {
    const role = this.getAuthenticatedRole();
    switch (role) {
      case 'PATIENT':
        this.router.navigateByUrl(this.returnUrl);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  // Helper function to easily access form controls in the template
  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequestP: AuthPatientLogin = {
        // Retrieve values directly from the form group
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };

      const loginRequestD: AuthDoctorLogin = {
        // Retrieve values directly from the form group
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };

      const loginRequestA = {
        // Retrieve values directly from the form group
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };

      let loginObservable: Observable<any>;
      let redirectPath: string;

      if (this.loginMode === 'patient') {
        loginObservable = this.patientAuthService.login(loginRequestP);
        redirectPath = '/patient/dashboard';
      } else if (this.loginMode === 'doctor') {
        loginObservable = this.doctorAuthService.login(loginRequestD);
        redirectPath = '/doctor/dashboard';
      } else if (this.loginMode === 'admin') {
        loginObservable = this.adminAuthService.login(loginRequestA);
        redirectPath = '/admin/dashboard';
      }
      loginObservable!.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate([redirectPath]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error?.error?.message ||
            `Login failed for ${this.loginMode}. Invalid credentials or network error.`;
          console.error('Login error:', error);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isPatientMode: boolean = true;
  loginMode: LoginMode = 'patient';

  toggleLoginMode(mode: LoginMode): void {
    this.loginMode = mode;
    this.errorMessage = '';
    this.loginForm.reset();
  }
}
