import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Weather } from './weather.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7183';

  getTestData(): Observable<Weather[]> {
    return this.http.get<Weather[]>(`${this.apiUrl}/WeatherForecast`);
  }
}
