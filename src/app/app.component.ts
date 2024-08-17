import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { User } from './models/user';
import { UserService } from './services/user-service.service';
import { Subject, takeUntil } from 'rxjs';
import { ChessHttpService } from './services/chess-http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChessBoardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: User | null = null;
  userId: string | null = null;

  title = 'chess-app';

  constructor(private userService: UserService, private router: Router, private httpService: ChessHttpService) {}

  ngOnInit() {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        if (!user) {
          this.router.navigate(['/']); 
        }
      });
  }

  receiveData(data: string) {
    this.userId = data;
    console.log(this.userId)
  }

  navigateToMenu() {
    this.userService.setUser(this.user!);
    this.router.navigate(['/menu']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
