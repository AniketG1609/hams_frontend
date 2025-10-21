import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PatientAuthService } from '../../../core/services/patient-auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private patientAuthService = inject(PatientAuthService);
  private router = inject(Router);

  logout() {
    this.patientAuthService.logout();
  }
}
