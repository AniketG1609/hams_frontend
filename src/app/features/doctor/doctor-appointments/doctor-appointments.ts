import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Appointment } from '../../../models/appointment-interface';

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.html',
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink],
})
export class DoctorAppointments implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  currentAppointmentId: number | null = null;

  // Filters
  searchTerm = '';
  dateFilter = 'all';
  statusFilter = 'all';

  // Stats
  todayCount = 0;
  pendingCount = 0;
  confirmedCount = 0;
  completedCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // 🔹 Placeholder for backend integration
  loadAppointments(): void {
    // Later, replace this with:
    // this.http.get<Appointment[]>('API_URL/appointments').subscribe(data => { ... });

    this.appointments = [
      {
        id: 1,
        patient: { name: 'Sarah Johnson', age: 34, gender: 'Female', phone: '+1 234-567-8900' },
        date: '2025-10-13',
        time: '09:00',
        duration: 30,
        type: 'Regular Checkup',
        status: 'confirmed',
        notes: '',
      },
      {
        id: 2,
        patient: { name: 'Michael Brown', age: 45, gender: 'Male', phone: '+1 234-567-8901' },
        date: '2025-10-13',
        time: '10:30',
        duration: 30,
        type: 'Follow-up Visit',
        status: 'confirmed',
        notes: '',
      },
      {
        id: 3,
        patient: { name: 'Emma Wilson', age: 28, gender: 'Female', phone: '+1 234-567-8902' },
        date: '2025-10-13',
        time: '14:00',
        duration: 30,
        type: 'New Patient Consultation',
        status: 'pending',
        notes: '',
      },
      {
        id: 4,
        patient: { name: 'James Davis', age: 52, gender: 'Male', phone: '+1 234-567-8903' },
        date: '2025-10-14',
        time: '09:30',
        duration: 45,
        type: 'Specialist Consultation',
        status: 'pending',
        notes: '',
      },
      {
        id: 5,
        patient: { name: 'Lisa Anderson', age: 39, gender: 'Female', phone: '+1 234-567-8904' },
        date: '2025-10-12',
        time: '11:00',
        duration: 30,
        type: 'Regular Checkup',
        status: 'completed',
        notes: 'Patient doing well. Prescribed medication for minor cold.',
      },
    ];

    this.filteredAppointments = [...this.appointments];
    this.updateStats();
  }

  updateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    this.todayCount = this.appointments.filter((a) => a.date === today).length;
    this.pendingCount = this.appointments.filter((a) => a.status === 'pending').length;
    this.confirmedCount = this.appointments.filter((a) => a.status === 'confirmed').length;
    this.completedCount = this.appointments.filter((a) => a.status === 'completed').length;
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  filterAppointments(): void {
    const search = this.searchTerm.toLowerCase();
    const today = new Date();

    this.filteredAppointments = this.appointments.filter((a) => {
      const matchesSearch = a.patient.name.toLowerCase().includes(search);
      const matchesStatus = this.statusFilter === 'all' || a.status === this.statusFilter;
      const appointmentDate = new Date(a.date);
      let matchesDate = true;

      if (this.dateFilter === 'today') {
        matchesDate = appointmentDate.toDateString() === today.toDateString();
      } else if (this.dateFilter === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        matchesDate = appointmentDate.toDateString() === tomorrow.toDateString();
      } else if (this.dateFilter === 'week') {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        matchesDate = appointmentDate >= today && appointmentDate <= weekFromNow;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  confirmAppointment(id: number): void {
    const appointment = this.appointments.find((a) => a.id === id);
    if (!appointment) return;

    if (confirm(`Confirm appointment with ${appointment.patient.name}?`)) {
      appointment.status = 'confirmed';
      this.updateStats();
      this.filterAppointments();
      alert(`✅ Appointment confirmed for ${appointment.patient.name}`);
    }
  }

  cancelAppointment(id: number): void {
    const appointment = this.appointments.find((a) => a.id === id);
    if (!appointment) return;

    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      appointment.status = 'cancelled';
      this.updateStats();
      this.filterAppointments();
      alert(`❌ Appointment cancelled for ${appointment.patient.name}`);
    }
  }

  startConsultation(id: number): void {
    alert(`🩺 Starting consultation for appointment ID: ${id}`);
  }

  viewNotes(notes: string): void {
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
