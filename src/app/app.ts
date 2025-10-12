import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/components/footer/footer';
import { Landing } from './features/landing/landing';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';
import { PatientDashboard } from './features/patient/patient-dashboard/patient-dashboard';
import { Login } from './features/auth/login/login';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('hams');
}
