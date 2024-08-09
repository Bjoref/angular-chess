import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessPiece } from '../../models/chessPieces';

@Component({
  selector: 'app-chess-piece',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img [src]="getImageUrl()" [alt]="piece.type" class="chess-piece">
  `,
  styleUrls: ['./chess-piece.component.scss']
})
export class ChessPieceComponent {
  @Input() piece!: ChessPiece;

  getImageUrl(): string {
    return `/assets/images/chess/${this.piece.color}-${this.piece.type}.svg`;
  }
}
