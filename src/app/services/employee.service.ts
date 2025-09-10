import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmployeePersonal } from '../models/extraction-detail.model.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  public getEmployees(): Observable<EmployeePersonal[]> {
    // Create headers as required by your API (similar to login)
    const headers = new HttpHeaders({
      'in_userid': this.getUserId(),
      'pal-correlation-id': this.generateCorrelationId(),
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });

    return this.http.get<EmployeePersonal[]>(`${this.apiBaseUrl}/api/Employee`, { headers });
  }

  private getUserId(): string {
    // Get user ID from localStorage (stored during login)
    return localStorage.getItem('userId') || '1';
  }

  private generateCorrelationId(): string {
    // Generate GUID for correlation ID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
