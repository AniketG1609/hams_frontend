import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DoctorAuthService } from '../../../core/services/doctor-auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
  private doctorAuthService = inject(DoctorAuthService);
  private router = inject(Router);

  ngOnInit() {
    // Ensure user is doctor
    if (!this.doctorAuthService.canAccess('DOCTOR')) {
      this.router.navigate(['/auth/login']);
    }
  }
  logout() {
    this.doctorAuthService.logout();
  }
}
