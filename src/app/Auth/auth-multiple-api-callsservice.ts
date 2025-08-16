//Update AuthService with Refresh Queue

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class MultiApiAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  // Adjust the API URL as needed
  private apiUrl = 'https://localhost:7183/api/auth';
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

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

  refreshTokenRequest(): Observable<any> {
    if (!this.refreshToken) return of(null);

    // If already refreshing, return observable that waits for refresh to finish
    if (this.refreshing) {
      return this.refreshSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap(() => of(this.accessToken))
      );
    }

    this.refreshing = true;

    return this.http
      .post<any>(`${this.apiUrl}/refresh`, {
        refreshToken: this.refreshToken,
      })
      .pipe(
        tap((res) => {
          this.accessToken = res.accessToken;
          localStorage.setItem('refreshToken', res.refreshToken);
          this.refreshing = false;
          this.refreshSubject.next(res.accessToken); // release waiting requests
        })
      );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
