import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'https://localhost:7183/api/chat';

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/ask`, { question });
  }
}
