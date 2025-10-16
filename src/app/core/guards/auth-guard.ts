import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PatientAuthService } from '../services/patient-auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(PatientAuthService);
  const router = inject(Router);

  return authService.isAuthenticated$().pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};
