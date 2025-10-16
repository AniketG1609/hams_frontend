// doctor-availability.component.ts (Updated)

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvailabilitySlot } from '../../../models/availabilityslot-interface';
import { DoctorAvailabilityService } from '../../../core/services/doctor-availability.service';

@Component({
  selector: 'app-doctor-availability',
  templateUrl: './doctor-availability.html',
  styleUrls: ['./doctor-availability.css'],
  standalone: true, // You may need this depending on your setup
  imports: [CommonModule, FormsModule, RouterLink],
})
export class DoctorAvailability implements OnInit {
  currentTab: 'slots' | 'add' = 'slots';

  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Initialize as empty array, data will be fetched in ngOnInit
  scheduledSlots: AvailabilitySlot[] = [];

  newSlot: Partial<AvailabilitySlot> = {
    day: '',
    startTime: '09:00',
    endTime: '17:00',
    duration: 30,
  };

  isEditMode: boolean = false; // To track if we are editing an existing slot

  // Inject the new service
  constructor(private availabilityService: DoctorAvailabilityService) {}

  ngOnInit(): void {
    this.fetchScheduledSlots(); // Fetch data when the component initializes
  }

  fetchScheduledSlots(): void {
    this.availabilityService.getScheduledSlots().subscribe({
      next: (slots) => {
        this.scheduledSlots = slots;
        console.log('Slots fetched:', slots);
      },
      error: (err) => {
        console.error('Failed to fetch availability slots:', err);
        alert('Could not load availability. Please check the backend connection.');
        // FALLBACK: Use dummy data if API fails during development
        this.scheduledSlots = [
          { id: 1, day: 'Monday', startTime: '09:00', endTime: '12:00', duration: 30 },
          { id: 2, day: 'Tuesday', startTime: '14:00', endTime: '18:00', duration: 45 },
          { id: 3, day: 'Thursday', startTime: '08:00', endTime: '16:00', duration: 60 },
        ] as AvailabilitySlot[];
      },
    });
  }

  switchTab(tab: 'slots' | 'add'): void {
    this.currentTab = tab;
    // When switching to 'add' tab, reset the form unless we are already in edit mode
    if (tab === 'add' && !this.isEditMode) {
      this.resetForm();
    }
  }

  // --- Form Logic ---

  saveNewSlot(): void {
    // 1. Validation (Input sanitation and format checks should also be done)
    if (
      !this.newSlot.day ||
      !this.newSlot.startTime ||
      !this.newSlot.endTime ||
      !this.newSlot.duration
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // Ensure duration is a number
    const slotData: AvailabilitySlot = {
      ...this.newSlot,
      duration: +this.newSlot.duration!,
    } as AvailabilitySlot;

    // Determine whether to CREATE or UPDATE
    if (this.isEditMode && slotData.id) {
      this.availabilityService.updateSlot(slotData).subscribe({
        next: (updatedSlot) => {
          alert('Slot updated successfully!');
          this.fetchScheduledSlots(); // Refresh the list
          this.resetForm();
          this.switchTab('slots');
        },
        error: (err) => alert('Failed to update slot. Error: ' + err.message),
      });
    } else {
      // Create new slot
      this.availabilityService.saveNewSlot(slotData).subscribe({
        next: (createdSlot) => {
          alert('Availability slot added successfully!');
          this.fetchScheduledSlots(); // Refresh the list
          this.resetForm();
          this.switchTab('slots');
        },
        error: (err) => alert('Failed to save new slot. Error: ' + err.message),
      });
    }
  }

  resetForm(): void {
    this.newSlot = {
      day: '',
      startTime: '09:00',
      endTime: '17:00',
      duration: 30,
    };
    this.isEditMode = false;
  }

  // --- Table/Slot Management Logic ---

  editSlot(slot: AvailabilitySlot): void {
    this.newSlot = { ...slot }; // Load data into the form model
    this.isEditMode = true; // Set edit flag
    this.switchTab('add'); // Switch to the form tab
  }

  deleteSlot(id: number): void {
    if (
      confirm(
        'Are you sure you want to delete this availability slot? This action cannot be undone.'
      )
    ) {
      this.availabilityService.deleteSlot(id).subscribe({
        next: () => {
          alert('Slot deleted successfully!');
          this.scheduledSlots = this.scheduledSlots.filter((slot) => slot.id !== id);
        },
        error: (err) => alert('Failed to delete slot. Error: ' + err.message),
      });
    }
  }
}
