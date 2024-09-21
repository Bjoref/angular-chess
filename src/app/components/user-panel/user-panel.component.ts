import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumbersDirective } from '../../directives/numbersOnly.directive';
import { UserIdService } from '../../services/user-id.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  // Создаем Subject для подписки на изменения userId
  private userIdSubject = new Subject<number>();
  private subscription: Subscription = new Subscription();

  constructor(private userIdService: UserIdService) {}

  ngOnInit(): void {
    // Логика для выбора случайного логотипа
    if (Math.floor(Math.random() * 2) + 1 === 1) {
      this.randomLogo = 'assets/images/mock-data/king-one.svg';
    } else {
      this.randomLogo = 'assets/images/mock-data/king-two.svg';
    }

    // Подписка на изменения userId с debounce 3000ms
    this.subscription = this.userIdSubject
      .pipe(
        distinctUntilChanged() // Обрабатываем только измененные значения
      )
      .subscribe((userId: number) => {
        this.userIdService.currentId = userId; // Обновляем значение в сервисе
      });
  }

  // Вызывается при изменении значения инпута
  onUserIdChange(newUserId: number): void {
    this.userIdSubject.next(newUserId); // Отправляем новое значение в поток
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Отписываемся от потока при уничтожении компонента
    }
  }
}
