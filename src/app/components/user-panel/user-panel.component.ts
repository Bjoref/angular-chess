import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumbersDirective } from '../../directives/numbersOnly.directive';
import { UserIdService } from '../../services/user-id.service';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [FormsModule, NumbersDirective],
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit, OnDestroy {
  randomLogo: string = '';
  userId: number = 1;

  // Subject для изменений userId
  private userIdSubject = new Subject<number>();
  private subscription: Subscription = new Subscription();

  constructor(private userIdService: UserIdService) {}

  ngOnInit(): void {
    // Выбираем случайный логотип
    this.randomLogo =
      Math.floor(Math.random() * 2) + 1 === 1
        ? 'assets/images/mock-data/king-one.svg'
        : 'assets/images/mock-data/king-two.svg';

    // Подписка на изменения userId
    this.subscription = this.userIdSubject
      .pipe(distinctUntilChanged())
      .subscribe((userId: number) => {
        this.userIdService.setUserId(userId); // Сохраняем ID пользователя в сервисе
      });
  }

  // Метод, вызываемый при изменении значения ID
  onUserIdChange(newUserId: number): void {
    this.userIdSubject.next(newUserId); // Отправляем новое значение в поток
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Отписываемся при уничтожении компонента
  }
}
