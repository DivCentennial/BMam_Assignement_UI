import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  username = '';
  password = '';
  isFormValid = false;

  constructor(private router: Router) {}

  onInputChange() {
    this.isFormValid = this.username.trim() !== '' && this.password.trim() !== '';
  }

  onSubmit() {
    if (this.isFormValid) {
      if (this.username === 'admin' && this.password === 'password123') {
        this.loginSuccess.emit();
        this.router.navigate(['/mainpage']);
      } else {
        alert('Invalid username or password');
      }
    }
  }
}
