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

  // // refreshTokenRequest(): Observable<LoginResponse> {
  // //   //const refreshToken = localStorage.getItem('refreshToken');
  // //   return this.http
  // //     .post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken })
  // //     .pipe(
  // //       tap((res) => {
  // //         localStorage.setItem('accessToken', res.accessToken);
  // //         localStorage.setItem('refreshToken', res.refreshToken);
  // //       })
  // //     );
  // // }
  // refreshTokenRequest(): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {
  //     accessToken: this.getAccessToken(),
  //     refreshToken: this.getRefreshToken(),
  //   });
  // }
  // logout(): void {
  //   const refreshToken = localStorage.getItem('refreshToken')!;
  //   this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   this.router.navigate(['/login']);
  // }

  // // private hasToken(): boolean {
  // //   return !!localStorage.getItem('accessToken');
  // // }

  // get accessToken(): string | null {
  //   return localStorage.getItem('accessToken');
  // }

  // set accessToken(token: string | null) {
  //   token
  //     ? localStorage.setItem('accessToken', token)
  //     : localStorage.removeItem('accessToken');
  // }
  // set refreshToken(token: string | null) {
  //   token
  //     ? localStorage.setItem('refreshToken', token)
  //     : localStorage.removeItem('refreshToken');
  // }

  // getAccessToken(): string | null {
  //   const token = localStorage.getItem('accessToken');
  //   if (token && this.isTokenInvalid(token)) {
  //     // 🚨 tampered or expired → logout immediately
  //     this.logout();
  //     return null;
  //   }
  //   return token;
  // }
  // private isTokenInvalid(token: string): boolean {
  //   try {
  //     const decoded: any = jwtDecode(token);
  //     const exp = decoded.exp * 1000; // convert to ms
  //     return Date.now() > exp; // expired
  //   } catch (e) {
  //     // 🚨 invalid token structure (tampered)
  //     return true;
  //   }
  // }
  // getRefreshToken(): string | null {
  //   return localStorage.getItem('refreshToken');
  // }
  // saveTokens(accessToken: string, refreshToken: string): void {
  //   localStorage.setItem('accessToken', accessToken);
  //   localStorage.setItem('refreshToken', refreshToken);
  // }

  // login(username: string, password: string): Observable<LoginResponse> {
  //   return this.http
  //     .post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
  //     .pipe(
  //       tap((res: any) => {
  //         this.saveTokens(res.accessToken, res.refreshToken);
  //       })
  //     );
  // }

  // refreshTokenRequest(): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/refresh`, {
  //     refreshToken: this.getRefreshToken(),
  //   });
  // }

  // logout(): void {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   this.router.navigate(['/login']);
  // }

  // saveTokens(accessToken: string, refreshToken: string): void {
  //   localStorage.setItem('accessToken', accessToken);
  //   localStorage.setItem('refreshToken', refreshToken);
  // }

  // getAccessToken(): string | undefined {
  //   const token = localStorage.getItem('accessToken');
  //   if (token && this.isTokenInvalid(token)) {
  //     // 🚨 tampered or expired
  //     this.logout();
  //     return undefined;
  //   }
  //   return token || undefined;
  // }

  // getRefreshToken(): string | null {
  //   return localStorage.getItem('refreshToken');
  // }

  // private isTokenInvalid(token: string): boolean {
  //   try {
  //     const decoded: any = jwtDecode(token);
  //     const exp = decoded.exp * 1000; // convert to ms
  //     return Date.now() > exp; // expired
  //   } catch (e) {
  //     // 🚨 invalid token structure (tampered)
  //     return true;
  //   }
  // }

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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
