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

  registerUser(id: string, color: number = 0): Observable<string> {
    return this.http.get(`${this.apiUrl}Queue/Register?playerToken=${id}&preferedColor=${color}`, { responseType: 'text' });
  }

  getUserInQueue(id: string, guid: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}Queue/GetStatus?playerToken=${id}&guid=${guid}`);
  }

  getGameInfo(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}Game/GetInfo?gameId=${id}`);
  }

  move(gameId: string, playerToken: string, fromPosition: string, toPosition: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Game/Move?gameId=${gameId}&playerToken=${playerToken}&fromPosition=${fromPosition}&toPosition=${toPosition}`);
  }
}
