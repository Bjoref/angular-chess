import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ChessPiece,
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
} from '../models/chessPieces';
import { ChessRulesService } from './chess-rules.service';

@Injectable({
  providedIn: 'root',
})
export class ChessBoardService {
  private boardStateSubject = new BehaviorSubject<(ChessPiece | null)[][]>(
    this.initializeBoard()
  );
  boardState$ = this.boardStateSubject.asObservable();
  private draggedPiece: {
    piece: ChessPiece;
    from: { row: number; col: number };
  } | null = null;

  private whiteTurn = true; // Индикатор текущего хода (белые или черные)

  constructor(private chessRulesService: ChessRulesService) {}

  initializeBoard(): (ChessPiece | null)[][] {
    const emptyRow: (ChessPiece | null)[] = Array(8).fill(null);
    return [
      [
        new Rook('black', { row: 0, col: 0 }),
        new Knight('black', { row: 0, col: 1 }),
        new Bishop('black', { row: 0, col: 2 }),
        new Queen('black', { row: 0, col: 3 }),
        new King('black', { row: 0, col: 4 }),
        new Bishop('black', { row: 0, col: 5 }),
        new Knight('black', { row: 0, col: 6 }),
        new Rook('black', { row: 0, col: 7 }),
      ],
      Array(8)
        .fill(null)
        .map((_, col) => new Pawn('black', { row: 1, col })),
      ...Array(4)
        .fill(null)
        .map(() => emptyRow.slice()), // Создаем отдельные пустые ряды
      Array(8)
        .fill(null)
        .map((_, col) => new Pawn('white', { row: 6, col })),
      [
        new Rook('white', { row: 7, col: 0 }),
        new Knight('white', { row: 7, col: 1 }),
        new Bishop('white', { row: 7, col: 2 }),
        new Queen('white', { row: 7, col: 3 }),
        new King('white', { row: 7, col: 4 }),
        new Bishop('white', { row: 7, col: 5 }),
        new Knight('white', { row: 7, col: 6 }),
        new Rook('white', { row: 7, col: 7 }),
      ],
    ];
  }

  getBoardState(): (ChessPiece | null)[][] {
    return this.boardStateSubject.getValue();
  }

  getValidMoves(
    piece: ChessPiece,
    row: number,
    col: number
  ): { row: number; col: number }[] {
    return this.chessRulesService.getValidMoves(
      piece,
      row,
      col,
      this.getBoardState()
    );
  }

  isWhiteTurn(): boolean {
    return this.whiteTurn;
  }

  onDragStart(row: number, col: number, event: DragEvent) {
    const board = this.getBoardState();
    const piece = board[row][col];

    // Если это не ход текущего игрока, предотвращаем перетаскивание
    if (
      !piece ||
      (this.whiteTurn && piece.color !== 'white') ||
      (!this.whiteTurn && piece.color !== 'black')
    ) {
      event.preventDefault();
      return;
    }

    this.draggedPiece = { piece, from: { row, col } };

    const target = event.target as HTMLElement;
    const dragImage = target.cloneNode(true) as HTMLElement;

    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    document.body.appendChild(dragImage);

    event.dataTransfer?.setDragImage(
      dragImage,
      target.clientWidth / 2,
      target.clientHeight / 2
    );

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }

  onDrop(row: number, col: number) {
    if (this.draggedPiece) {
      const board = this.getBoardState().map((row) => [...row]);
      const { piece, from } = this.draggedPiece;

      const validMoves = this.getValidMoves(piece, from.row, from.col);
      const isValidMove = validMoves.some(
        (move) => move.row === row && move.col === col
      );

      if (isValidMove) {
        const targetPiece = board[row][col]; // Получаем фигуру на целевой клетке

        // Если на целевой клетке есть фигура и она вражеская
        const audio = targetPiece
          ? new Audio('assets/sounds/capture.mp3')
          : new Audio('assets/sounds/move.mp3');

        // Срубаем вражескую фигуру
        if (targetPiece && targetPiece.color !== piece.color) {
          board[row][col] = null; // Сначала удаляем вражескую фигуру
        }

        // Перемещаем нашу фигуру на новую позицию
        board[from.row][from.col] = null;
        piece.position = { row, col };
        board[row][col] = piece;

        this.boardStateSubject.next(board);
        this.whiteTurn = !this.whiteTurn; // Меняем ход после успешного хода

        audio.play(); // Проигрываем звук
      }

      this.draggedPiece = null;
    }
  }
}
