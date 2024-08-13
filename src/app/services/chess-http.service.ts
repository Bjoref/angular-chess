import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChessHttpService {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:5140/api/';

  constructor() {}

  startNewGame(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}Queue/Register?playerToken=${id}`, { responseType: 'text' });
  }

  getUserInQueue(id: string, guid: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Queue/GetStatus?playerToken=${id}&guid=${guid}`);
  }
}
