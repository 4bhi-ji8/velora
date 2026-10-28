import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';

interface LoginResponse {
  status: string;
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient)

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(
      'http://localhost:3000/api/auth/login',
      {
        email,
        password
      }
    )
  }

  setToken(token: string): void {
    localStorage.setItem('token' ,token)
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProfile() {
    return this.http.get<User>(
      'http://localhost:3000/api/auth/profile'
    )
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  register(
    fullName: string,
    email: string,
    phone: string,
    password : string
  ){
    return this.http.post(
      'http://localhost:3000/api/auth/register',
      {
        fullName,
        email,
        phone,
        password
      }
    )
  }
}
