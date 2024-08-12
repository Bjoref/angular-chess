import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChessHttpService } from '../services/chess-http.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(private router: Router) {}

  chessHttpService = inject(ChessHttpService);
  startNewGame() {
    this.router.navigate(['/game']);
    // this.chessHttpService.startNewGame().subscribe(
    //   (response) => {
    //     console.log('Game started:', response);
    //   },
    //   (error) => {
    //     console.error('Error starting game:', error);
    //   }
    // );
  }
}
