import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { User } from './models/user';
import { UserService } from './services/user-service.service';
import { Subject, takeUntil, timer } from 'rxjs';
import { ChessHttpService } from './services/chess-http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChessBoardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public user: User | null = null;
  public userId: string | null = null;
  public showContentAfterLoad: boolean = false;

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
    timer(5000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showContentAfterLoad = true;
    })
  }

  receiveData(data: string) {
    this.userId = data;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
