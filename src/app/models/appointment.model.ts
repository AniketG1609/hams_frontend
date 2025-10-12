export interface Patient {
  name: string;
  age: number;
  gender: string;
  phone: string;
}

export interface Appointment {
  id: number;
  patient: Patient;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
}
