import { NotificationService } from './../../../core/services/patient-notification-service';
// DoctorDashboard.ts (or AdminDashboard.ts)

import { Component, OnInit } from '@angular/core';
// 💡 If you encountered TS2835 errors (module resolution), this import must be:
// import { AppointmentService } from '../../../core/services/appointment.service.js';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/doctor-appointment-service.js';
import { Appointment } from '../../../models/doctor-appointment-interface';
import { DoctorHeader } from '../../../shared/doctor/header/header.js';
import { NotificationResponseDTO } from '../../../models/notification-interface.js';
import { DoctorResponseDTO } from '../../../models/doctor-interface.js';
import { DoctorService } from '../../../core/services/doctor-service.js';
import { DoctorNotificationService } from '../../../core/services/doctor-notification-service';
import { Sidebar } from '@shared/doctor/sidebar/sidebar';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DoctorHeader, Sidebar],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
  AppointmentCount: number = 0;
  totalPatientCount: number = 0;
  pendingReviewsCount: number = 0; // 🔑 New property for Pending Reviews
  doctor: DoctorResponseDTO | null = null;
  notifications: NotificationResponseDTO[] = [];
  stats = {
    upcomingAppointments: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
    notifications: 0,
  };

  todayAppointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private notificationService: DoctorNotificationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDoctorProfile();
    this.fetchNotificationCount();
    this.fetchAppointmentCount();
    this.fetchTotalPatientCount();
    this.fetchPendingReviewsCount();
    this.fetchTodayAppointments();
  }

  // DoctorDashboard.ts

  fetchAppointmentCount(): void {
    this.appointmentService.getTodayAppointmentCount().subscribe({
      next: (count: number) => {
        this.AppointmentCount = count;
      },
      error: (err: any) => {
        console.error('Failed to fetch today appointment count:', err);
        // Handle error display
      },
    });
  }

  /**
   * 🔑 New method to fetch the total number of patients.
   */
  fetchTotalPatientCount(): void {
    this.appointmentService.getTotalPatientCount().subscribe({
      next: (count: number) => {
        // Assign the fetched count to the new property
        this.totalPatientCount = count;
      },
      error: (err: any) => {
        console.error('Failed to fetch total patient count:', err);
        this.totalPatientCount = 12; // Set to 0 or a placeholder on failure
      },
    });
  }

  fetchPendingReviewsCount(): void {
    this.appointmentService.getPendingReviewsCount().subscribe({
      next: (count: number) => {
        this.pendingReviewsCount = count;
      },
      error: (err: any) => {
        console.error('Failed to fetch pending reviews count:', err);
        this.pendingReviewsCount = 2;
      },
    });
  }

  // DoctorDashboard.ts (or the component where this method resides)

  // Assuming 'this.doctorService' refers to the service containing getLoggedInDoctorProfile
  // If you injected it as 'doctorAuthService', update the property name accordingly.

  fetchDoctorProfile(): void {
    // Assuming DoctorAuthService has a method to get the logged-in doctor's profile
    // 🔑 FIX: Add parentheses () to call the method and return the Observable.
    this.doctorService.getLoggedInDoctorProfile().subscribe({
      next: (profile: DoctorResponseDTO) => {
        this.doctor = profile; // 👈 Populates the 'doctor' property
      },
      error: (err: any) => {
        console.error('Failed to fetch doctor profile:', err);
        // Handle error: e.g., redirect or set a default
      },
    });
  }

  fetchNotificationCount(): void {
    // 🔑 FIX 1: Change 'markAllAsRead' to a method designed to GET the count (e.g., 'getUnreadNotificationCount').
    // 🔑 FIX 2: Add parentheses () to call the method.
    this.notificationService.getUnreadNotificationCount().subscribe({
      next: (count: number) => {
        // The service should return the count, which is then assigned to stats.notifications
        this.stats.notifications = count;
      },
      error: (err: any) => {
        console.error('Failed to fetch notification count:', err);
        this.stats.notifications = 0; // Set to 0 on failure
      },
    });
  }

  generateInitials(fullName: string): string {
    if (!fullName) return 'SB';

    const nameParts = fullName
      .trim()
      .split(/\s+/)
      .filter((part) => part.length > 0);

    if (nameParts.length < 2) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  }

  generateRandomDoctorName(): string {
    const firstNames = [
      'John',
      'Jane',
      'Michael',
      'Sarah',
      'David',
      'Emily',
      'Robert',
      'Lisa',
      'William',
      'Anna',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Rodriguez',
      'Martinez',
    ];

    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomFirst} ${randomLast}`;
  }

  fetchTodayAppointments(): void {
    this.appointmentService.getTodayAppointmentsForDoctor().subscribe({
      next: (appointments: Appointment[]) => {
        this.todayAppointments = appointments;
      },
      error: (err: any) => {
        console.error('Failed to fetch today appointments:', err);
        this.todayAppointments = [];
      },
    });
  }

  confirmAppointment(appointmentId: number): void {
    this.appointmentService.confirmAppointment(appointmentId).subscribe({
      next: () => {
        this.fetchTodayAppointments(); // Refresh the list
        alert('Appointment confirmed successfully!');
      },
      error: (err: any) => {
        console.error('Failed to confirm appointment:', err);
        alert('Failed to confirm appointment.');
      },
    });
  }

  rejectAppointment(appointmentId: number, reason?: string): void {
    this.appointmentService.rejectAppointment(appointmentId, reason).subscribe({
      next: () => {
        this.fetchTodayAppointments(); // Refresh the list
        alert('Appointment rejected successfully!');
      },
      error: (err: any) => {
        console.error('Failed to reject appointment:', err);
        alert('Failed to reject appointment.');
      },
    });
  }
}
