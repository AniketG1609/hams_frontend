import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../models/patient-interface';

// 1. Define the interfaces for type safety (keep these in a dedicated models file in a real app)

@Component({
  selector: 'app-patient-management',
  standalone: true, // Use standalone component for modern Angular setup
  imports: [CommonModule, FormsModule, RouterLink], // Import necessary Angular modules
  templateUrl: './patient-management.html',
  styleUrl: './patient-management.css', // Assuming you have a CSS file
})
export class PatientManagement implements OnInit {
  // --- Data State ---
  // Inject the service in the constructor
  constructor(private patientService: PatientService) {}

  public filteredPatients: Patient[] = [];
  public currentView: 'grid' | 'list' = 'grid';
  public searchTerm: string = '';
  public genderFilter: string = 'all';
  public ageFilter: string = 'all';
  public sortFilter: string = 'name';

  public totalCount: number = 0;
  public newCount: number = 0;
  public activeCount: number = 0;
  public followupCount: number = 0;

  public selectedPatient: Patient | null = null;
  public showProfileModal: boolean = false;

  ngOnInit(): void {
    // Subscribe to the service data stream if using RxJS, or just call initial methods:
    this.patientService.allPatients$.subscribe(() => {
      this.refreshView();
    });
  }

  // --- Core View Refresh Logic ---

  public refreshView(): void {
    // 1. Get filtered/sorted data from the service
    this.filteredPatients = this.patientService.filterAndSortPatients(
      this.searchTerm,
      this.genderFilter,
      this.ageFilter,
      this.sortFilter
    );

    // 2. Calculate stats based on the FULL patient list
    const allPatients = this.patientService.getPatients();
    const stats = this.patientService.calculateStats(allPatients);

    this.totalCount = stats.totalCount;
    this.newCount = stats.newCount;
    this.activeCount = stats.activeCount;
    this.followupCount = stats.followupCount;
  }

  // --- Utility Methods ---

  public getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }

  public getDaysSinceVisit(lastVisitDate: string): number {
    const lastVisit = new Date(lastVisitDate).getTime();
    return Math.floor((new Date().getTime() - lastVisit) / (1000 * 60 * 60 * 24));
  }

  public formatVisitDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // --- View Control & Actions ---

  public switchView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  public viewProfile(patient: Patient): void {
    this.selectedPatient = patient;
    this.showProfileModal = true;
  }

  public closeModal(): void {
    this.showProfileModal = false;
    this.selectedPatient = null;
  }

  public bookAppointment(patient: Patient): void {
    console.log(`[ACTION] Book Appointment for ${patient.name}.`);
    this.closeModal();
  }

  public sendMessage(patient: Patient): void {
    console.log(`[ACTION] Send Message to ${patient.name}.`);
    this.closeModal();
  }

  public viewMedicalRecords(patient: Patient): void {
    console.log(`[ACTION] Viewing records for ${patient.name}.`);
  }
}
