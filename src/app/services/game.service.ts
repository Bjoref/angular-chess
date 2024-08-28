import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGameSubject = new BehaviorSubject<Game | null>(null);
  public currentColor: string = 'white'

  // Наблюдаемая переменная для текущей игры
  currentGame$ = this.currentGameSubject.asObservable();

  setCurrentColor(color: string) {
    this.currentColor = color;
  }

  // Метод для установки текущей игры
  setGame(game: Game) {
    this.currentGameSubject.next(game);
  }

  // Метод для получения текущей игры
  getCurrentGame(): Game | null {
    return this.currentGameSubject.getValue();
  }

  // Метод для обновления игры
  updateGame(game: Game) {
    this.setGame(game);
  }
}
