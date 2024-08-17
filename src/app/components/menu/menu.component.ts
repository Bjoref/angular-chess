import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { User } from '../../models/user';
import { Subject, takeUntil } from 'rxjs';
import { ChessHttpService } from '../../services/chess-http.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private chessHttpService: ChessHttpService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

    if (!this.user) {
      this.router.navigate(['/']);
    }
  }
  
  startNewGame(): void {
    if (this.user) {
      const id = this.user.id;
      this.chessHttpService
        .registerUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (guid) => {
            console.log('Game started with GUID:', guid);
            this.userService.updateUserGuid(guid); // Обновляем guid пользователя в сервисе
            this.getUserQueueStatus(id, guid);
            this.router.navigate(['/game']);
          },
          (error) => {
            console.error('Error starting game:', error);
          }
        );
    } else {
      this.router.navigate(['/']);
    }
  }

  private getUserQueueStatus(id: string, guid: string): void {
    this.chessHttpService.getUserInQueue(id, guid)
    . pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
