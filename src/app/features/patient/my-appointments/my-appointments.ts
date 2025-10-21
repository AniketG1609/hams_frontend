import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/patient/header/header';
import { AppointmentResponseDTO } from '../../../models/appointment-interface';
import { Patient } from '../../../models/patient-interface';
import { PatientService } from '../../../core/services/patient.service';
import { Sidebar } from '../../../shared/patient/sidebar/sidebar';
import { AppointmentService } from '../../../core/services/patient-appointment.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css'],
})
export class MyAppointments implements OnInit {
  appointments: AppointmentResponseDTO[] = [];
  filteredAppointments: AppointmentResponseDTO[] = [];
  patient: Patient | null = null;
  filterStatus: string = 'all';
  showCancelModal: boolean = false;
  appointmentToCancel: AppointmentResponseDTO | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPatientData();
    this.loadAppointments();
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
        this.appointments = appointments;
        this.filterAppointments();
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      },
    });
  }

  filterAppointments(): void {
    if (this.filterStatus === 'all') {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter(
        (apt) => apt.status === this.filterStatus
      );
    }
  }

  onFilterChange(): void {
    this.filterAppointments();
  }

  openCancelModal(appointment: AppointmentResponseDTO): void {
    this.appointmentToCancel = appointment;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.appointmentToCancel = null;
  }

  cancelAppointment(): void {
    if (this.appointmentToCancel) {
      this.appointmentService.cancelAppointment(this.appointmentToCancel.appointmentId).subscribe({
        next: () => {
          this.loadAppointments();
          this.closeCancelModal();
        },
        error: (error) => {
          console.error('Error canceling appointment:', error);
        },
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  canCancelAppointment(status: string): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  getDoctorInitials(doctorName: string): string {
    return doctorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
