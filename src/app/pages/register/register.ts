import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  phone = '';
  password = '';
  showPassword = false;

  successMessage = signal('');
  errorMessage = signal('');

  register(): void {
    this.authService.register(this.fullName, this.email, this.phone, this.password).subscribe({
      next: (response: any) => {
        this.successMessage.set(response.message);
        console.log('Registration successfull', response);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('Registration failed', error);
        this.errorMessage.set(error.error.message || 'Registration failed. Please try again.');
      },
    });
  }
}
