export interface AuthDoctorRequest extends AuthDoctorLogin {
  doctorName: string;
  qualification: string;
  specialization: string;
  clinicAddress: string;
  yearOfExperience: number; // Maps from Java Integer
  contactNumber: string;
  email: string;
}

export interface AuthDoctorResponse {
  token: string;
  type: 'Bearer';
  doctor: Doctor;
}

export interface AuthDoctorLogin {
  username: string;
  password: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  qualification: string;
  specialization: string;
  yearsOfExperience: number;
  licenseNumber: string;
  clinicAddress: string;
}

export interface DoctorStats {
  totalDoctors: number;
  totalPatients: number;
  todaysAppointments: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
