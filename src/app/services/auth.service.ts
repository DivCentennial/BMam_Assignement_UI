import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for login request
export interface LoginRequest {
  username: string;
  password: string;
}

// Interface for login response (based on your Swagger)
export interface LoginResponse {
  userId: number;
  userName: string;
  passwordHash: string;
  role: string;
  employeeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBaseUrl = 'https://localhost:7166';

  constructor(private http: HttpClient) {}

  /**
   * Login user with username and password
   * @param credentials - Login credentials
   * @returns Observable with login response
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Create headers as required by your API
    const headers = new HttpHeaders({
      'in_userid': '1',                    // Required header
      'pal-correlation-id': this.generateCorrelationId(), // Required header
      'Content-Type': 'application/json',  // Content type
      'accept': 'application/json'         // Accept header
    });

    // Make POST request to your backend
    return this.http.post<LoginResponse>(
      `${this.apiBaseUrl}/api/Auth/login`,
      credentials,
      { headers }
    );
  }

  /**
   * Generate a correlation ID (GUID) as required by your API
   * @returns string - Correlation ID
   */
  private generateCorrelationId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Store user data in localStorage after successful login
   * @param response - Login response from backend
   */
  storeUserData(response: LoginResponse): void {
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userName', response.userName);
    localStorage.setItem('role', response.role);
    localStorage.setItem('employeeId', response.employeeId.toString());
  }

  /**
   * Check if user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('userId') !== null;
  }

  /**
   * Get current user data
   * @returns object with user data or null
   */
  getCurrentUser(): any {
    if (this.isLoggedIn()) {
      return {
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        role: localStorage.getItem('role'),
        employeeId: localStorage.getItem('employeeId')
      };
    }
    return null;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.removeItem('employeeId');
  }
}