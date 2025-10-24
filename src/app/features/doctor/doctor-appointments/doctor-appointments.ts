import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/doctor-appointment-service.js';

interface Patient {
  name: string;
  age: number;
  gender: string;
  phone: string;
}

interface Doctor {
  doctorId: number;
  doctorName: string;
  specialization: string;
}

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  patient: Patient;
  doctor: Doctor;
}

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  templateUrl: './doctor-appointments.html',
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink],
})
export class DoctorAppointments implements OnInit {
  private appointmentService = inject(AppointmentService);

  appointments = signal<Appointment[]>([]);
  filteredAppointments = signal<Appointment[]>([]);
  isLoading = signal(true);
  currentAppointmentId: number | null = null;

  // Filters
  searchTerm = '';
  dateFilter = 'all';
  statusFilter = 'all';

  // Stats
  todayCount = signal(0);
  pendingCount = signal(0);
  confirmedCount = signal(0);
  completedCount = signal(0);

  // constructor(private http: HttpClient) {}

  isNotesModalOpen = signal(false);
  consultationNotes = { diagnosis: '', symptoms: '', notes: '', prescription: '' };

  ngOnInit(): void {
    this.loadAppointments();
  }

  // 🔹 Placeholder for backend integration
  loadAppointments(): void {
    this.isLoading.set(true);
    // Fetch all appointments for client-side filtering flexibility
    this.appointmentService.getDoctorAppointments('all').subscribe({
      next: (data) => {
        this.appointments.set(data); // Update signal
        this.updateStats();
        this.filterAppointments(); // Apply initial filters
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        this.appointments.set([]);
        this.isLoading.set(false);
        alert('Failed to load appointments. Check your network or API response.');
      },
    });
  }

  updateStats(): void {
    const apps = this.appointments();
    const today = new Date().toISOString().split('T')[0];
    this.todayCount.set(apps.filter((a) => a.appointmentDate === today).length);
    this.pendingCount.set(apps.filter((a) => a.status === 'PENDING').length);
    this.confirmedCount.set(apps.filter((a) => a.status === 'CONFIRMED').length);
    this.completedCount.set(apps.filter((a) => a.status === 'COMPLETED').length);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  filterAppointments(): void {
    const search = this.searchTerm.toLowerCase();
    const today = new Date();

    const filtered = this.appointments().filter((a) => {
      const matchesSearch = a.patient.name.toLowerCase().includes(search);
      // Status filter compares component property (e.g., 'PENDING') with API response status (e.g., 'PENDING')
      const matchesStatus = this.statusFilter === 'all' || a.status === this.statusFilter;

      const appointmentDate = new Date(a.appointmentDate);
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const appointmentDateOnly = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate()
      );
      let matchesDate = true;

      if (this.dateFilter === 'today') {
        matchesDate = appointmentDateOnly.getTime() === todayDateOnly.getTime();
      } else if (this.dateFilter === 'tomorrow') {
        const tomorrow = new Date(todayDateOnly);
        tomorrow.setDate(todayDateOnly.getDate() + 1);
        matchesDate = appointmentDateOnly.getTime() === tomorrow.getTime();
      } else if (this.dateFilter === 'week') {
        const weekFromNow = new Date(todayDateOnly);
        weekFromNow.setDate(todayDateOnly.getDate() + 7);
        matchesDate =
          appointmentDateOnly.getTime() >= todayDateOnly.getTime() &&
          appointmentDateOnly.getTime() <= weekFromNow.getTime();
      } else if (this.dateFilter === 'month') {
        matchesDate =
          appointmentDate.getFullYear() === today.getFullYear() &&
          appointmentDate.getMonth() === today.getMonth();
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Update filtered list signal
    this.filteredAppointments.set(filtered);
  }

  // 🔹 Backend Action: Confirm Appointment
  confirmAppointment(id: number): void {
    const appointment = this.appointments().find((a) => a.appointmentId === id);
    if (!appointment) return;

    if (confirm(`Confirm appointment with ${appointment.patient.name}?`)) {
      this.appointmentService.confirmAppointment(id).subscribe({
        next: () => {
          alert(`✅ Appointment confirmed for ${appointment.patient.name}`);
          this.loadAppointments(); // Reload data
        },
        error: (err) => {
          console.error('Confirm failed:', err);
          alert('Failed to confirm appointment. Try again.');
        },
      });
    }
  }

  // 🔹 Backend Action: Cancel/Reject Appointment
  cancelAppointment(id: number): void {
    const appointment = this.appointments().find((a) => a.appointmentId === id);
    if (!appointment) return;

    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      this.appointmentService.rejectAppointment(id, reason).subscribe({
        next: () => {
          alert(`❌ Appointment rejected for ${appointment.patient.name}`);
          this.loadAppointments(); // Reload data
        },
        error: (err) => {
          console.error('Reject failed:', err);
          alert('Failed to reject appointment. Try again.');
        },
      });
    }
  }

  // 🔹 UI Action: Open Consultation Modal
  startConsultation(id: number): void {
    this.currentAppointmentId = id;
    this.consultationNotes = { diagnosis: '', symptoms: '', notes: '', prescription: '' }; // Reset form
    this.isNotesModalOpen.set(true);
  }

  // 🔹 Backend Action: Save Notes and Complete Appointment
  saveNotes(): void {
    if (!this.currentAppointmentId) return;

    const payload = { ...this.consultationNotes };

    this.appointmentService.saveConsultationNotes(this.currentAppointmentId, payload).subscribe({
      next: () => {
        alert('Consultation notes saved and appointment marked as COMPLETED!');
        this.isNotesModalOpen.set(false); // Close modal
        this.loadAppointments(); // Reload data
      },
      error: (err) => {
        console.error('Save notes failed:', err);
        alert('Failed to save notes. Check your API configuration.');
      },
    });
  }

  viewNotes(notes: string): void {
    // This is a placeholder; in a real app, you would fetch the specific notes for the completed appointment ID.
    alert(`📝 Consultation Notes:\n\n${notes}`);
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
