import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  username = '';
  password = '';
  isFormValid = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onInputChange() {
    this.isFormValid = this.username.trim() !== '' && this.password.trim() !== '';
  }

  onSubmit() {
    if (this.isFormValid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Create login request object
      const loginRequest: LoginRequest = {
        username: this.username,
        password: this.password
      };

      // Call the backend API
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          
          // Store user data in localStorage
          this.authService.storeUserData(response);
          
          // Stop loading
          this.isLoading = false;
          
          // Emit success event
          this.loginSuccess.emit();
          
          // Navigate to main page
          this.router.navigate(['/mainpage']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          
          // Stop loading
          this.isLoading = false;
          
          // Show error message
          this.errorMessage = 'Login failed. Please check your credentials.';
          
          // You can also show more specific error messages
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          }
        }
      });
    }
  }
}
