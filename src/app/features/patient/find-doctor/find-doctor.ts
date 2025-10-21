import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../shared/patient/header/header';
import { Patient } from '../../../models/patient-interface';
import { AppointmentDTO } from '../../../models/appointment-interface';
import { PatientService } from '../../../core/services/patient.service';
import { Sidebar } from '../../../shared/patient/sidebar/sidebar';
import { DoctorResponseDTO } from '../../../models/doctor-interface';
import { AppointmentService } from '../../../core/services/patient-appointment.service';

@Component({
  selector: 'app-find-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Header],
  templateUrl: './find-doctor.html',
  styleUrls: ['./find-doctor.css'],
})
export class FindDoctorComponent implements OnInit {
  doctors: DoctorResponseDTO[] = [];
  filteredDoctors: DoctorResponseDTO[] = [];
  patient: Patient | null = null;
  searchTerm: string = '';
  searchType: 'name' | 'specialization' = 'name';
  showBookingModal: boolean = false;
  selectedDoctor: DoctorResponseDTO | null = null;

  appointmentData: AppointmentDTO = {
    doctorId: 0,
    appointmentDate: '',
    startTime: '',
    endTime: '',
    reason: '',
  };

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatientData();
    this.loadAllDoctors();
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

  loadAllDoctors(): void {
    this.patientService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = doctors;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
      },
    });
  }

  searchDoctors(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDoctors = this.doctors;
      return;
    }

    if (this.searchType === 'name') {
      this.patientService.searchDoctorByName(this.searchTerm).subscribe({
        next: (doctors) => {
          this.filteredDoctors = doctors;
        },
        error: (error) => {
          console.error('Error searching doctors by name:', error);
        },
      });
    } else {
      this.patientService.searchDoctorBySpecialization(this.searchTerm).subscribe({
        next: (doctors) => {
          this.filteredDoctors = doctors;
        },
        error: (error) => {
          console.error('Error searching doctors by specialization:', error);
        },
      });
    }
  }

  openBookingModal(doctor: DoctorResponseDTO): void {
    this.selectedDoctor = doctor;
    this.appointmentData.doctorId = doctor.doctorId;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedDoctor = null;
    this.appointmentData = {
      doctorId: 0,
      appointmentDate: '',
      startTime: '',
      endTime: '',
      reason: '',
    };
  }

  bookAppointment(): void {
    if (
      this.appointmentData.doctorId &&
      this.appointmentData.appointmentDate &&
      this.appointmentData.startTime &&
      this.appointmentData.endTime
    ) {
      this.appointmentService.bookAppointment(this.appointmentData).subscribe({
        next: (appointment) => {
          console.log('Appointment booked successfully:', appointment);
          this.closeBookingModal();
          this.router.navigate(['/patient/my-appointments']);
        },
        error: (error) => {
          console.error('Error booking appointment:', error);
        },
      });
    }
  }

  getDoctorInitials(doctorName: string): string {
    return doctorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
