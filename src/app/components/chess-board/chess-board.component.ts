import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessPieceComponent } from '../chess-piece/chess-piece.component';
import { ChessBoardService } from '../../services/chess-board.service';
import { Observable } from 'rxjs';
import { ChessPiece } from '../../models/chessPieces';

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessPieceComponent],
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {
  rows = Array(8).fill(0);
  cols = Array(8).fill(0);
  boardState$: Observable<(ChessPiece | null)[][]>;
  highlightMoves: { row: number, col: number }[] = [];
  captureMoves: { row: number, col: number }[] = [];

  constructor(private chessBoardService: ChessBoardService) {
    this.boardState$ = this.chessBoardService.boardState$;
  }

  ngOnInit() {}

  onDragStart(event: DragEvent, row: number, col: number) {
    this.chessBoardService.onDragStart(row, col, event);

    const board = this.chessBoardService.getBoardState(); // Используем существующий метод boardState$
    const piece = board[row][col];
    if (piece) {
      const moves = this.chessBoardService.getValidMoves(piece, row, col);
      this.highlightMoves = moves.filter(move => !board[move.row][move.col]);
      this.captureMoves = moves.filter(move => board[move.row][move.col] && board[move.row][move.col]?.color !== piece.color);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, row: number, col: number) {
    this.chessBoardService.onDrop(row, col);
    this.clearHighlights();
  }

  clearHighlights() {
    this.highlightMoves = [];
    this.captureMoves = [];
  }

  isHighlighted(row: number, col: number): boolean {
    return this.highlightMoves.some(move => move.row === row && move.col === col);
  }

  isCapture(row: number, col: number): boolean {
    return this.captureMoves.some(move => move.row === row && move.col === col);
  }
}
