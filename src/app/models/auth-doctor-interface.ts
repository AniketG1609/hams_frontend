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
  patient: Doctor;
}

export interface AuthDoctorLogin {
  username: string;
  password: string;
}

export interface Doctor {
  doctorId: number; // Maps from Java Long
  doctorName: string;
  qualification: string;
  specialization: string;
  clinicAddress: string;
  yearOfExperience: number; // Maps from Java Integer
  contactNumber: string;
  email: string;
}
