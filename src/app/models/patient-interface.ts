import { MedicalRecord } from './medicalrecord-interface';

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  registrationDate: string;
  lastVisit: string;
  totalVisits: number;
  activeTreatments: number;
  medicalHistory: MedicalRecord[];
}
