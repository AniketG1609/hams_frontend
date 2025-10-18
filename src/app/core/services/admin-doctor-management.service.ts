import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponse, Doctor, PaginatedResponse } from '../../models/auth-doctor-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDoctorManagementService {
  private http = inject(HttpClient);
  private apiUrlForGetAllDoctors = `${environment.apiUrl} + ${environment.admin.getAllDoctors}`;
  private apiUrlForGetDoctor = `${environment.apiUrl} + ${environment.doctor.getDoctor}`;
  private apiUrlForUpdateDoctor = `${environment.apiUrl} + ${environment.admin.updateDoctor}`;
  private apiUrlDeleteDoctor = `${environment.apiUrl} + ${environment.admin.deleteDoctor}`;

  getDoctors(
    page: number = 0,
    size: number = 10,
    status?: string,
    search?: string
  ): Observable<PaginatedResponse<Doctor>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<Doctor>>(this.apiUrlForGetAllDoctors, { params });
  }

  getDoctorById(): Observable<ApiResponse<Doctor>> {
    return this.http.get<ApiResponse<Doctor>>(`${this.apiUrlForGetDoctor}`);
  }

  updateDoctor(id: string, doctorData: Partial<Doctor>): Observable<ApiResponse<Doctor>> {
    return this.http.put<ApiResponse<Doctor>>(`${this.apiUrlForUpdateDoctor}/${id}`, doctorData);
  }

  deleteDoctor(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrlDeleteDoctor}/${id}`);
  }
}
