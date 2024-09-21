import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { GameService } from '../../services/game.service';
import { UiSelectComponent } from '../ui/ui-select/ui-select.component';
import { UiButtonComponent } from '../ui/ui-button/ui-button.component';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { UserIdService } from '../../services/user-id.service';
import { ChessHttpService } from '../../services/chess-http.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiSelectComponent,
    UiButtonComponent,
    UserPanelComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  @Output() userId: EventEmitter<string> = new EventEmitter<string>();
  private destroy$ = new Subject<void>();
  user: User | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private userIdService: UserIdService,
    private chessHttpService: ChessHttpService,
    private gameService: GameService
  ) {
    console.log(this.userIdService);
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
  }

  registerUser = (): void => {};

  startNewGame = (): void => {
    const userId = this.userIdService.currentId.toString();

    // Загружаем пользователя по ID и сохраняем в сервисе
    this.userService.loadUserById(userId).subscribe((user) => {
      if (user) {
        this.gameService.setCurrentColor(user.side);
      } else {
        alert('User not found');
      }
    });

    this.chessHttpService
      .registerUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (guid) => {
          console.log('Game started with GUID:', guid);
          this.userService.updateUserGuid(guid); // Обновляем guid пользователя в сервисе
          this.getUserQueueStatus(userId, guid);
          this.router.navigate(['/game']);
        },
        (error) => {
          console.error('Error starting game:', error);
        }
      );
  };

  private getUserQueueStatus(id: string, guid: string): void {
    this.chessHttpService
      .getUserInQueue(id, guid)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
