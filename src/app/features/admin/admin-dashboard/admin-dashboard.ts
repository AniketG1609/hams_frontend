import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { AdminDoctorManagementService } from '../../../core/services/admin-doctor-management.service';
import { Doctor, DoctorStats } from '../../../models/auth-doctor-interface';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private adminAuthService = inject(AdminAuthService);
  private adminDoctorManagementService = inject(AdminDoctorManagementService);
  private router = inject(Router);

  // UI State
  showDoctorRegistration = signal(false);
  showNotifications = signal(false);
  showProfileDropdown = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);

  // Data
  doctors = signal<Doctor[]>([]);
  stats = signal<DoctorStats>({
    totalDoctors: 0,
    totalPatients: 0,
    todaysAppointments: 0,
  });
  specializations = signal<string[]>([]);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);

  // Filters
  statusFilter = signal<string>('');
  searchTerm = signal('');

  ngOnInit() {
    // Ensure user is admin
    if (!this.adminAuthService.canAccess('ADMIN')) {
      this.router.navigate(['/auth/login']);
    }
  }

  logout() {
    this.adminAuthService.logout();
  }
}
