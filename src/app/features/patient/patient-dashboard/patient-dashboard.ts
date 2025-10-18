import { PatientAuthService } from './../../../core/services/patient-auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  imports: [RouterLink],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard implements OnInit {
  private PatientAuthService = inject(PatientAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Ensure user is patient
    if (!this.PatientAuthService.canAccess('PATIENT')) {
      this.router.navigate(['/auth/login']);
    }
  }

  logout() {
    this.PatientAuthService.logout();
  }
}
