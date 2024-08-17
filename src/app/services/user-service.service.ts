import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  http = inject(HttpClient);

  private usersUrl = 'assets/users.json';

  // Метод для получения всех пользователей
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  // Наблюдаемая переменная для текущего пользователя
  currentUser$ = this.currentUserSubject.asObservable();

  // Метод для установки текущего пользователя
  setUser(user: User) {
    this.currentUserSubject.next(user);
  }

  // Метод для получения текущего пользователя
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  // Метод для поиска пользователя по ID и сохранения его в currentUserSubject
  loadUserById(id: string): Observable<User | null> {
    return this.getUsers().pipe(
      map(users => users.find(user => user.id === id) || null),
      map(user => {
        if (user) {
          this.setUser(user);
        }
        return user;
      })
    );
  }

  // Метод для обновления guid у текущего пользователя
  updateUserGuid(guid: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Обновляем объект пользователя с новым guid
      const updatedUser = { ...currentUser, guid };
      this.setUser(updatedUser);
    }
  }
}
