import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Patient interface
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  totalVisits: number;
  activeTreatments: number;
  lastVisit: string;
  registrationDate: string;
  medicalHistory: Array<{
    date: string;
    type: string;
    notes: string;
  }>;
}

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-management.html',
  styleUrl: './patient-management.css',
})
export class PatientManagement implements OnInit {
  // View state
  currentView: 'grid' | 'list' = 'grid';
  showProfileModal = false;
  selectedPatient: Patient | null = null;

  // Filter state
  searchTerm = '';
  genderFilter = 'all';
  ageFilter = 'all';
  sortFilter = 'name';

  // Statistics
  totalCount = 0;
  newCount = 0;
  activeCount = 0;
  followupCount = 0;

  // Sample data - replace with actual service calls
  patients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      bloodGroup: 'O+',
      address: '123 Main St, City, State',
      totalVisits: 5,
      activeTreatments: 2,
      lastVisit: '2024-01-15',
      registrationDate: '2023-06-01',
      medicalHistory: [
        { date: '2024-01-15', type: 'Checkup', notes: 'Regular checkup, all vitals normal' },
        { date: '2023-12-10', type: 'Follow-up', notes: 'Follow-up for medication' },
      ],
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      phone: '+1-555-0124',
      email: 'jane.smith@email.com',
      bloodGroup: 'A+',
      address: '456 Oak Ave, City, State',
      totalVisits: 3,
      activeTreatments: 1,
      lastVisit: '2024-01-10',
      registrationDate: '2023-08-15',
      medicalHistory: [
        { date: '2024-01-10', type: 'Consultation', notes: 'Initial consultation for symptoms' },
      ],
    },
  ];

  get filteredPatients(): Patient[] {
    let filtered = [...this.patients];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Gender filter
    if (this.genderFilter !== 'all') {
      filtered = filtered.filter((patient) => patient.gender === this.genderFilter);
    }

    // Age filter
    if (this.ageFilter !== 'all') {
      filtered = filtered.filter((patient) => {
        const age = patient.age;
        switch (this.ageFilter) {
          case '0-18':
            return age >= 0 && age <= 18;
          case '19-35':
            return age >= 19 && age <= 35;
          case '36-60':
            return age >= 36 && age <= 60;
          case '60+':
            return age > 60;
          default:
            return true;
        }
      });
    }

    // Sort filter
    filtered.sort((a, b) => {
      switch (this.sortFilter) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return a.age - b.age;
        case 'visits':
          return b.totalVisits - a.totalVisits;
        case 'lastVisit':
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }

  ngOnInit() {
    this.calculateStats();
  }

  calculateStats() {
    this.totalCount = this.patients.length;
    this.newCount = this.patients.filter((p) => {
      const regDate = new Date(p.registrationDate);
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return regDate >= monthAgo;
    }).length;
    this.activeCount = this.patients.reduce((sum, p) => sum + p.activeTreatments, 0);
    this.followupCount = this.patients.filter((p) => {
      const lastVisit = new Date(p.lastVisit);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 30;
    }).length;
  }

  switchView(view: 'grid' | 'list') {
    this.currentView = view;
  }

  refreshView() {
    // This method is called when filters change
    // The filteredPatients getter will automatically update
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getDaysSinceVisit(lastVisit: string): number {
    const visitDate = new Date(lastVisit);
    const now = new Date();
    return Math.floor((now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  formatVisitDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  viewProfile(patient: Patient) {
    this.selectedPatient = patient;
    this.showProfileModal = true;
  }

  closeModal() {
    this.showProfileModal = false;
    this.selectedPatient = null;
  }

  bookAppointment(patient: Patient) {
    // Implement booking logic
    console.log('Booking appointment for:', patient.name);
  }

  sendMessage(patient: Patient) {
    // Implement messaging logic
    console.log('Sending message to:', patient.name);
  }

  viewMedicalRecords(patient: Patient) {
    // Implement medical records view
    console.log('Viewing medical records for:', patient.name);
  }
}
