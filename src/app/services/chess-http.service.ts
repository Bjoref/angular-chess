import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChessHttpService {
  http = inject(HttpClient);
  private apiUrl = ' http://localhost:5140/api/';

  constructor() {}

  startNewGame(): Observable<any> {
    return this.http.get(`${this.apiUrl}Queue/Register?playerToken=${1}`);
  }
}
