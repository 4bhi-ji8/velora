import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  errorMessage = signal('');

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);

        this.authService.getProfile().subscribe({
          next: (user) => {
            if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (error) => {
            console.error('Failed to get user profile:', error);
          },
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  testProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile:', response);
      },
      error: (error) => {
        console.error('Profile failed:', error);
      },
    });
  }
}
