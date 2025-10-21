import { Component, Input } from '@angular/core';
import { Patient } from '../../../models/patient-interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  @Input() patient: Patient | null = null;
  @Input() notificationCount: number = 0;

  showNotifications = false;
  showProfile = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }
  getInitials(name: string | undefined): string {
    if (!name) return 'P';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
