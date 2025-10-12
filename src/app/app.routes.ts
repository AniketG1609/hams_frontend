import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { PatientDashboard } from './features/patient/patient-dashboard/patient-dashboard';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DoctorAppointments } from './features/doctor/doctor-appointments/doctor-appointments';

export const routes: Routes = [
  // Public routes (Landing, About, etc.)
  {
    path: '',
    component: PublicLayout,
    children: [{ path: '', component: Landing }],
  },
  // Patient Dashboard
  {
    path: 'patient',
    component: DashboardLayout,
    children: [{ path: 'dashboard', component: PatientDashboard }],
  },
  // Doctor Dashboard
  {
    path: 'doctor',
    component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        component: DoctorDashboard,
      },
      {
        path: 'appointments',
        component: DoctorAppointments,
      },
    ],
  },
  //Auth routes (Login, Register, etc.)
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
    ],
  },
];
