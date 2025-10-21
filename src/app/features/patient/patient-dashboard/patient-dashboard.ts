import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppointmentResponseDTO } from '../../../models/appointment-interface';
import { Patient } from '../../../models/patient-interface';
import { Header } from '../../../shared/patient/header/header';
import { MedicalRecordResponseDTO } from '../../../models/medicalrecord-interface';
import { NotificationResponseDTO } from '../../../models/notification-interface';
import { PatientService } from '../../../core/services/patient.service';
import { Sidebar } from '../../../shared/patient/sidebar/sidebar';
import { AppointmentService } from '../../../core/services/patient-appointment.service';
import { MedicalRecordService } from '../../../core/services/medical-record.service';
import { NotificationService } from '../../../core/services/patient-notification.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, Header],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css'],
})
export class PatientDashboard implements OnInit {
  patient: Patient | null = null;
  upcomingAppointments: AppointmentResponseDTO[] = [];
  medicalRecords: MedicalRecordResponseDTO[] = [];
  notifications: NotificationResponseDTO[] = [];
  stats = {
    upcomingAppointments: 0,
    activePrescriptions: 0,
    medicalRecords: 0,
    notifications: 0,
  };

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private medicalRecordService: MedicalRecordService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatientData();
    this.loadAppointments();
    this.loadMedicalRecords();
    this.loadNotifications();
  }

  loadPatientData(): void {
    this.patientService.getPatient().subscribe({
      next: (patient) => {
        this.patient = patient;
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
      },
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointmentsForPatient().subscribe({
      next: (appointments) => {
        this.upcomingAppointments = appointments
          .filter((apt) => apt.status === 'PENDING' || apt.status === 'CONFIRMED')
          .slice(0, 3);
        this.stats.upcomingAppointments = this.upcomingAppointments.length;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      },
    });
  }

  loadMedicalRecords(): void {
    this.medicalRecordService.getRecordsForPatient().subscribe({
      next: (records) => {
        this.medicalRecords = records;
        this.stats.medicalRecords = records.length;
        this.stats.activePrescriptions = records.reduce(
          (count, record) => count + (record.prescriptions ? record.prescriptions.length : 0),
          0
        );
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
      },
    });
  }

  loadNotifications(): void {
    this.notificationService.getPatientNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.stats.notifications = notifications.length;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      },
    });
  }

  navigateToFindDoctors(): void {
    this.router.navigate(['/patient/find-doctors']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
