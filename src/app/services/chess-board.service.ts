import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, Subject, switchMap, takeUntil, timer } from 'rxjs';
import {
  ChessPiece,
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  ChessPieceFactory,
  
} from '../models/chessPieces';
import { ChessHttpService } from './chess-http.service';
import { ChessRulesService } from './chess-rules.service';
import { User } from '../models/user';
import { UserService } from './user-service.service';
import { GameService } from './game.service';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class ChessBoardService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private boardStateSubject = new BehaviorSubject<(ChessPiece | null)[][]>([]); // Пустая доска при инициализации
  boardState$ = this.boardStateSubject.asObservable();
  private draggedPiece: {
    piece: ChessPiece;
    from: { row: number; col: number };
  } | null = null;
  private user: User | null = null;
  private game: Game | null = null;
  private ascii: any

  private whiteTurn = true; // Индикатор текущего хода (белые или черные)

  constructor(
    private chessRulesService: ChessRulesService,
    private chessHttpService: ChessHttpService,
    private userService: UserService,
    private gameService: GameService
  ) {
    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });

    this.gameService.currentGame$
      .pipe(takeUntil(this.destroy$))
      .subscribe((game) => {
        this.game = game;
      });

      this.subscribeToGameUpdates();
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
        // Конвертируем координаты в шахматную нотацию
        const fromPosition = this.convertToChessNotation(from.row, from.col);
        const toPosition = this.convertToChessNotation(row, col);

        // Отправка хода на сервер
        if (this.game?.id && this.user?.id) {
          this.chessHttpService
            .move(this.game.id, this.user.id, fromPosition, toPosition)
            .subscribe(
              (response) => {
                console.log('Move successful:', response);
              },
              (error) => {
                console.error('Error making move:', error);
              }
            );
        }
      }

      this.draggedPiece = null;
    }
  }

  convertToChessNotation(row: number, col: number): string {
    const columns = 'abcdefgh';
    const chessRow = 8 - row;
    const chessCol = columns[col];
    return `${chessCol}${chessRow}`;
  }

  private subscribeToGameUpdates() {
    this.gameService.currentGame$
      .pipe(
        takeUntil(this.destroy$),
        filter((game) => !!game),
        switchMap((game) => 
          timer(0, 1000).pipe(
            switchMap(() => this.chessHttpService.getAscii(game!.id))
          )
        )
      )
      .subscribe((ascii) => {
        this.ascii = ascii;
        this.updateBoardFromAscii(ascii.gameState); // Обновляем доску с сервера
      });
  }

  private updateBoardFromAscii(gameState: string) {
    // Разделяем строку на строки по переносу
    const rows = gameState.trim().split('\n');
    const newBoard: (ChessPiece | null)[][] = [];
  
    rows.forEach((row, rowIndex) => {
      const newRow: (ChessPiece | null)[] = [];
      // Отфильтровываем только те символы, которые являются фигурами или пустыми клетками
      const chars = row
        .replace(/[^prnbqkPRNBQK\.]/g, '')
        .split('');

      chars.forEach((char, colIndex) => {
        // Создаем фигуры или пустые клетки
        const piece = ChessPieceFactory.createPieceFromAscii(char, {
          row: rowIndex,
          col: colIndex,
        });
        newRow.push(piece);
      });

      if (newRow.length === 8) { // Убедимся, что длина строки соответствует ширине доски
        newBoard.push(newRow); 
      }
    });

    if (newBoard.length === 8) { // Убедимся, что высота доски 8
      this.boardStateSubject.next(newBoard); // Обновляем состояние доски
    }
  }
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
