import { Component, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorAuthService } from '../../../../core/services/doctor-auth.service';
import { AuthDoctorRequest } from '../../../../models/auth-doctor-interface';

@Component({
  selector: 'app-doctor-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './doctor-register.html',
  //   styleUrl: './doctor-register.css',
})
export class DoctorRegister {
  private fb = inject(FormBuilder);
  private authService = inject(DoctorAuthService);
  private router = inject(Router);

  // Inputs and Outputs
  isOpen = input.required<boolean>();
  specializations = input.required<string[]>();
  close = output<void>();
  doctorCreated = output<void>();

  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword = false;
  showConfirm = false;

  constructor() {
    this.registerForm = this.createForm();
  }

  // Custom Validator for Password Match
  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        doctorName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        contactNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],

        // Doctor specific fields from DTO
        qualification: ['', [Validators.required]],
        specialization: ['', [Validators.required]],
        yearOfExperience: ['', [Validators.required, Validators.min(0)]],
        clinicAddress: ['', [Validators.required, Validators.minLength(10)]],

        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get passwordMismatch(): boolean {
    return (
      this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerRequest: AuthDoctorRequest = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        contactNumber: this.registerForm.get('contactNumber')?.value,
        doctorName: this.registerForm.get('doctorName')?.value,
        qualification: this.registerForm.get('qualification')?.value,
        specialization: this.registerForm.get('specialization')?.value,
        clinicAddress: this.registerForm.get('clinicAddress')?.value,
        yearOfExperience: +this.registerForm.get('yearOfExperience')?.value, // Ensure number type
      };

      this.authService.register(registerRequest).subscribe({
        next: () => {
          this.isLoading = false;
          // After successful registration, redirect to login for initial sign-in
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message || 'Doctor registration failed. Please try again.';
          console.error('Doctor registration error:', error);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
