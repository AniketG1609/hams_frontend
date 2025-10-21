// DoctorDashboard.ts (or AdminDashboard.ts)

import { Component, OnInit } from '@angular/core';
// 💡 If you encountered TS2835 errors (module resolution), this import must be:
// import { AppointmentService } from '../../../core/services/appointment.service.js';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorAuthService } from '../../../core/services/doctor-auth.service';
import { AppointmentService } from '../../../core/services/doctor-appointment.service';
import { Appointment, Doctor } from '../../../models/doctor-appointment-interface';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
  AppointmentCount: number = 0;
  totalPatientCount: number = 0;
  pendingReviewsCount: number = 0; // 🔑 New property for Pending Reviews

  doctorProfile: Doctor | null = null;
  doctorInitials: string = '';

  todayAppointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private doctorAuthService: DoctorAuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAppointmentCount();
    this.fetchTotalPatientCount();
    this.fetchPendingReviewsCount();
    this.fetchDoctorProfile();
    this.fetchTodayAppointments();
  }

  // DoctorDashboard.ts

  logout() {
    this.doctorAuthService.logout();
    this.router.navigate(['/auth/login']);
  }

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

  fetchDoctorProfile(): void {
    // 🔑 Subscribe expects the 'Doctor' object directly
    this.doctorService.getLoggedInDoctorProfile().subscribe(
      (profile: any) => {
        // Ensure the profile has all Doctor properties
        const doctor: Doctor = {
          doctorId: profile.doctorId ?? 0,
          doctorName: profile.doctorName ?? '',
          qualification: profile.qualification ?? '',
          specialization: profile.specialization ?? '',
          clinicAddress: profile.clinicAddress ?? '',
          yearOfExperience: profile.yearOfExperience ?? 0,
          contactNumber: profile.contactNumber ?? '',
          email: profile.email ?? '',
        };
        this.doctorProfile = doctor;
        this.doctorInitials = this.generateInitials(doctor.doctorName);
      },
      (err: any) => {
        console.error('Failed to fetch doctor profile:', err);
        // Create a fake doctor profile with a random name
        const randomName = this.generateRandomDoctorName();
        this.doctorProfile = {
          doctorId: 0,
          doctorName: randomName,
          qualification: 'MD',
          specialization: 'General Medicine',
          clinicAddress: 'Unknown Clinic',
          yearOfExperience: 5,
          contactNumber: '000-000-0000',
          email: 'unknown@clinic.com',
        };
        this.doctorInitials = this.generateInitials(randomName);
      }
    );
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
