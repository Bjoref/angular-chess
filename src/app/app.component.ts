import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { User } from './models/user';
import { UserService } from './services/user-service.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChessBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: User | null = null;
  title = 'chess-app';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        console.log('User ID:', user?.id);
        console.log('User Nickname:', user?.name);
        console.log('User Side:', user?.side);
      });

    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        if (!user) {
          this.router.navigate(['/']); 
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
