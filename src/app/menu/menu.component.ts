import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service.service';
import { User } from '../models/user';
import { Subject, takeUntil } from 'rxjs';
import { ChessHttpService } from '../services/chess-http.service';

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
        .startNewGame(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            console.log('Game started:', response);
            this.getUserQueueStatus(id, response);
            // this.router.navigate(['/game']);
          },
          (error) => {
            console.error('Error starting game:', error);
            // Обработка ошибки (например, показ уведомления)
            alert('Failed to start the game. Please try again later.');
          }
        );
    } else {
      this.router.navigate(['/']);
    }
  }

  private getUserQueueStatus(id: string, guid: string): void {
    this.chessHttpService.getUserInQueue(id, guid)
    . pipe(takeUntil(this.destroy$))
    .subscribe(
      (responseOne => {
        console.log(responseOne)
      })
    )
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
