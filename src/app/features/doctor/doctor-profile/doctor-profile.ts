import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../models/auth-doctor-interface'; // Ensure correct path/extension
import { DoctorService } from '../../../core/services/doctor.service'; // Ensure correct path/extension
import { CommonModule } from '@angular/common'; // Needed for *ngIf (assuming component is standalone)

// 🔑 Define the Dummy Doctor Object
const DUMMY_DOCTOR: Doctor = {
  id: 0,
  name: 'Profile Unavailable', // Use simpler name for initials fallback
  qualification: 'M.B.B.S, M.D.',
  specialization: 'General Practice (Fallback)',
  clinicAddress: 'N/A: Error Fetching Data',
  yearsOfExperience: 0,
  phoneNumber: 'N/A',
  email: 'error@example.com',
  licenseNumber: 'N/A',
};

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  // 🔑 Ensure CommonModule is imported for *ngIf logic
  imports: [CommonModule],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit {
  // 🔑 Initialize the profile with the dummy data (not null)
  doctorProfile: Doctor = DUMMY_DOCTOR;
  loading: boolean = true; // 🔑 Add loading state

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctorProfile();
  }

  loadDoctorProfile(): void {
    this.loading = true; // Start loading

    this.doctorService.getLoggedInDoctorProfile().subscribe({
      next: (profile: Doctor) => {
        this.doctorProfile = profile;
        this.loading = false; // Data loaded successfully
      },
      error: (err: any) => {
        console.error('Failed to load doctor profile, using dummy data:', err);
        // 🔑 Set to DUMMY_DOCTOR on API error and stop loading
        this.doctorProfile = DUMMY_DOCTOR;
        this.loading = false;
      },
    });
  }
}
