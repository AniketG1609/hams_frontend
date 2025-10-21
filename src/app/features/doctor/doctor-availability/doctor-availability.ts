import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvailabilitySlot } from '../../../models/availabilityslot-interface';
import { DoctorAvailabilityService } from '../../../core/services/doctor-availability.service';

@Component({
  selector: 'app-doctor-availability',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-availability.html',
  styleUrls: ['./doctor-availability.css'],
})
export class DoctorAvailability implements OnInit {
  currentTab: 'slots' | 'add' = 'slots';

  daysOfWeek: string[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  scheduledSlots: AvailabilitySlot[] = [];
  newSlot: Partial<AvailabilitySlot> = {
    day: '',
    startTime: '09:00',
    endTime: '17:00',
    duration: 30,
  };

  isEditMode = false;
  editingSlotId: number | null = null;

  constructor(private availabilityService: DoctorAvailabilityService) {}

  ngOnInit(): void {
    this.fetchScheduledSlots();
  }

  fetchScheduledSlots(): void {
    this.availabilityService.getScheduledSlots().subscribe({
      next: (slots) => {
        this.scheduledSlots = slots;
      },
      error: (error) => {
        console.error('Failed to fetch availability slots:', error);
        alert('Could not load availability. Please try again.');
      },
    });
  }

  switchTab(tab: 'slots' | 'add'): void {
    this.currentTab = tab;
    if (tab === 'add' && !this.isEditMode) {
      this.resetForm();
    }
  }

  saveNewSlot(): void {
    if (!this.validateSlot()) return;

    const slotData: AvailabilitySlot = {
      ...this.newSlot,
      duration: +this.newSlot.duration!,
    } as AvailabilitySlot;

    if (this.isEditMode && this.editingSlotId) {
      this.availabilityService.updateSlot({ ...slotData, id: this.editingSlotId }).subscribe({
        next: () => {
          alert('Slot updated successfully!');
          this.handleSuccessfulSubmission();
        },
        error: (error) => alert('Failed to update slot: ' + error.message),
      });
    } else {
      this.availabilityService.saveNewSlot(slotData).subscribe({
        next: () => {
          alert('Availability slot added successfully!');
          this.handleSuccessfulSubmission();
        },
        error: (error) => alert('Failed to save new slot: ' + error.message),
      });
    }
  }

  private validateSlot(): boolean {
    if (
      !this.newSlot.day ||
      !this.newSlot.startTime ||
      !this.newSlot.endTime ||
      !this.newSlot.duration
    ) {
      alert('Please fill in all required fields.');
      return false;
    }

    if (this.newSlot.startTime >= this.newSlot.endTime) {
      alert('End time must be after start time.');
      return false;
    }

    return true;
  }

  private handleSuccessfulSubmission(): void {
    this.fetchScheduledSlots();
    this.resetForm();
    this.switchTab('slots');
  }

  resetForm(): void {
    this.newSlot = {
      day: '',
      startTime: '09:00',
      endTime: '17:00',
      duration: 30,
    };
    this.isEditMode = false;
    this.editingSlotId = null;
  }

  editSlot(slot: AvailabilitySlot): void {
    this.newSlot = { ...slot };
    this.isEditMode = true;
    this.editingSlotId = slot.id;
    this.switchTab('add');
  }

  deleteSlot(id: number): void {
    if (confirm('Are you sure you want to delete this availability slot?')) {
      this.availabilityService.deleteSlot(id).subscribe({
        next: () => {
          this.scheduledSlots = this.scheduledSlots.filter((slot) => slot.id !== id);
          alert('Slot deleted successfully!');
        },
        error: (error) => alert('Failed to delete slot: ' + error.message),
      });
    }
  }

  getDayDisplay(day: string): string {
    const dayMap: { [key: string]: string } = {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday',
    };
    return dayMap[day] || day;
  }
}
