import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7183/api/auth';

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
        })
      );
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  set accessToken(token: string | null) {
    token
      ? localStorage.setItem('accessToken', token)
      : localStorage.removeItem('accessToken');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  refreshTokenRequest() {
    if (!this.refreshToken) return of(null);

    return this.http
      .post<any>(`${this.apiUrl}/refresh`, {
        refreshToken: this.refreshToken,
      })
      .pipe(
        tap((res) => {
          this.accessToken = res.accessToken;
          localStorage.setItem('refreshToken', res.refreshToken);
        })
      );
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken')!;
    this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
