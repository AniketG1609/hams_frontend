import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PatientAuthService } from '../services/patient-auth.service';
import { map, take } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';
import { DoctorAuthService } from '../services/doctor-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const patientAuthService = inject(PatientAuthService);
  const doctorAuthService = inject(DoctorAuthService); // Inject doctor service
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);

  const isAuthenticated = () => {
    // Check if ANY service has a token, indicating a user is logged in
    return (
      patientAuthService.getToken() !== null ||
      doctorAuthService.getToken() !== null ||
      adminAuthService.getToken() !== null
    );
  };

  const getUserRole = (): string | null => {
    if (patientAuthService.getToken()) return 'PATIENT';
    if (doctorAuthService.getToken()) return 'DOCTOR';
    if (adminAuthService.getToken()) return 'ADMIN';
    return null;
  };

  const loggedIn = isAuthenticated();
  const userRole = getUserRole();

  if (!loggedIn) {
    // If not logged in, redirect to login with returnUrl
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Now that the user is authenticated (and we know their role),
  // we check if they have permission for the current route's required role.
  const requiredRole = route.data['role'];
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to the dashboard corresponding to their ACTUAL role
    switch (userRole) {
      case 'PATIENT':
        router.navigate(['/patient/dashboard']);
        break;
      case 'DOCTOR':
        router.navigate(['/doctor/dashboard']);
        break;
      case 'ADMIN':
        router.navigate(['/admin/dashboard']);
        break;
      default:
        // Should not happen if a token exists, but useful fallback
        router.navigate(['/dashboard']);
        break;
    }
    return false;
  }
  return true;
};
