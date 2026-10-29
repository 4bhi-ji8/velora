
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environments';

interface LoginResponse {
  status: string;
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        email,
        password,
      }
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProfile() {
    return this.http.get<User>(
      `${this.apiUrl}/profile`
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  register(
    fullName: string,
    email: string,
    phone: string,
    password: string
  ) {
    return this.http.post(
      `${this.apiUrl}/register`,
      {
        fullName,
        email,
        phone,
        password,
      }
    );
  }
}
