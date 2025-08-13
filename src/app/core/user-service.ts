import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Users } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7183/api/auth';

  Register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  getUserDetails(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}/user-details`);
  }
}
