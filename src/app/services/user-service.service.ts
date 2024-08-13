import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  http = inject(HttpClient);

  private usersUrl = 'assets/users.json';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
