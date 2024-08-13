import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const user = this.userService.getCurrentUser(); // Предполагается, что у вас есть метод для получения текущего пользователя

    if (!user) {
      this.router.navigate(['/']); // Если пользователя нет, перенаправляем на страницу логина
      return false;
    }

    return true; // Если пользователь есть, разрешаем доступ
  }
}
