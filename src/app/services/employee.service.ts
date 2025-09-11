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

  public getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

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

  public addEmployee(personalData: any, professionalData: any): Observable<any> {
    const headers = new HttpHeaders({
      'in_userid': this.getUserId(),
      'pal-correlation-id': this.generateCorrelationId(),
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-Role': 'Admin' // Required for the create endpoint
    });

    const requestBody = {
      Personal: personalData,
      Professional: professionalData
    };

    console.log('Add Employee API Call:', {
      url: `${this.apiBaseUrl}/api/Employee`,
      headers: headers,
      body: requestBody
    });
    console.log('Personal Data:', requestBody.Personal);
    console.log('Professional Data:', requestBody.Professional);
    
    // Log field lengths to help debug truncation issues
    console.log('Field Lengths - Personal:');
    Object.keys(requestBody.Personal).forEach(key => {
      const value = requestBody.Personal[key];
      if (typeof value === 'string') {
        console.log(`  ${key}: ${value.length} characters - "${value}"`);
      } else {
        console.log(`  ${key}: ${value} (${typeof value})`);
      }
    });
    
    console.log('Field Lengths - Professional:');
    Object.keys(requestBody.Professional).forEach(key => {
      const value = requestBody.Professional[key];
      if (typeof value === 'string') {
        console.log(`  ${key}: ${value.length} characters - "${value}"`);
      } else {
        console.log(`  ${key}: ${value} (${typeof value})`);
      }
    });

    return this.http.post(`${this.apiBaseUrl}/api/Employee`, requestBody, { headers });
  }

  public updateEmployee(employeeId: number, personalData: any, professionalData: any): Observable<any> {
    const headers = new HttpHeaders({
      'in_userid': this.getUserId(),
      'pal-correlation-id': this.generateCorrelationId(),
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-Role': 'Admin' // Required for the update endpoint
    });

    const requestBody = {
      Personal: personalData,
      Professional: professionalData
    };

    console.log('Update Employee API Call:', {
      url: `${this.apiBaseUrl}/api/Employee/${employeeId}`,
      headers: headers,
      body: requestBody
    });
    console.log('Personal Data:', requestBody.Personal);
    console.log('Professional Data:', requestBody.Professional);
    
    // Log field lengths to help debug truncation issues
    console.log('Field Lengths - Personal:');
    Object.keys(requestBody.Personal).forEach(key => {
      const value = requestBody.Personal[key];
      if (typeof value === 'string') {
        console.log(`  ${key}: ${value.length} characters - "${value}"`);
      } else {
        console.log(`  ${key}: ${value} (${typeof value})`);
      }
    });
    
    console.log('Field Lengths - Professional:');
    Object.keys(requestBody.Professional).forEach(key => {
      const value = requestBody.Professional[key];
      if (typeof value === 'string') {
        console.log(`  ${key}: ${value.length} characters - "${value}"`);
      } else {
        console.log(`  ${key}: ${value} (${typeof value})`);
      }
    });

    return this.http.put(`${this.apiBaseUrl}/api/Employee/${employeeId}`, requestBody, { headers });
  }

  public deleteEmployee(employeeId: number): Observable<any> {
    const headers = new HttpHeaders({
      'in_userid': this.getUserId(),
      'pal-correlation-id': this.generateCorrelationId(),
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'X-Role': 'Admin' // Required for the delete endpoint
    });

    return this.http.delete(`${this.apiBaseUrl}/api/Employee/${employeeId}`, { headers });
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
