import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessPieceComponent } from '../chess-piece/chess-piece.component';
import { ChessBoardService } from '../../services/chess-board.service';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil, switchMap, filter, catchError, take, finalize } from 'rxjs/operators';
import { ChessPiece } from '../../models/chessPieces';
import { UserService } from '../../services/user-service.service';
import { ChessHttpService } from '../../services/chess-http.service';
import { GameService } from '../../services/game.service';
import { User } from '../../models/user';
import { LoadingStatus } from '../../models/loadStatus';
import { UiSpinnerComponent } from '../ui/ui-spinner/ui-spinner.component';
import { SignalrService } from '../../services/signalr.service'; 

@Component({
  selector: 'app-chess-board',
  standalone: true,
  imports: [CommonModule, ChessPieceComponent, UiSpinnerComponent],
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit, OnDestroy {
  rows = Array(8).fill(0);
  cols = Array(8).fill(0);
  boardState$: Observable<(ChessPiece | null)[][]>;
  highlightMoves: { row: number, col: number }[] = [];
  captureMoves: { row: number, col: number }[] = [];
  currentPlayer = 'White';
  user: User | null = null;
  loadingStatus: LoadingStatus = LoadingStatus.Idle; // Статус загрузки
  private destroy$ = new Subject<void>(); // Для отмены подписок

  constructor(
    private chessBoardService: ChessBoardService,
    private userService: UserService,
    private chessHttpService: ChessHttpService,
    private gameService: GameService,
    public signalRService: SignalrService
  ) {
    this.boardState$ = this.chessBoardService.boardState$;
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser(); // Получаем текущего пользователя

    // Проверяем наличие пользователя
    if (this.user && this.user.id && this.user.guid) {
      // Выполняем запрос на получение данных о пользователе в очереди
      this.fetchGameInfo(this.user.id, this.user.guid);
    }

    this.updateCurrentPlayer();

    // this.signalRService.onNewGame().subscribe(data => { if (data != undefined) this.onNewGameFromSignalR(data); });
  }


  fetchGameInfo(id: string, guid: string) {
    this.loadingStatus = LoadingStatus.Loading; // Устанавливаем статус "Loading"
    timer(0, 1000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.chessHttpService.getUserInQueue(id, guid)),
        filter(gameId => gameId !== 0),
        switchMap(gameId => this.chessHttpService.getGameInfo(gameId)),
        take(1),
        catchError((error) => {
          console.error('Error fetching game data:', error);
          this.loadingStatus = LoadingStatus.Error; // Устанавливаем статус "Error" при ошибке
          return [];
        }),
        finalize(() => {
          this.loadingStatus = LoadingStatus.Success; // Устанавливаем статус "Success" при завершении запроса
        })
      )
      .subscribe(
        (gameData) => {
          console.log('Game data:', gameData);
          this.gameService.updateGame(gameData);
        }
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем все подписки при уничтожении компонента
  }

  updateCurrentPlayer() {
    this.currentPlayer = this.chessBoardService.isWhiteTurn() ? 'White' : 'Black';
  }

  // Остальные методы остались без изменений
  onDragStart(event: DragEvent, row: number, col: number) {
    const board = this.chessBoardService.getBoardState();
    const piece = board[row][col];

    if (piece && ((this.currentPlayer === 'White' && piece.color === 'white') || (this.currentPlayer === 'Black' && piece.color === 'black'))) {
      this.chessBoardService.onDragStart(row, col, event);

      const moves = this.chessBoardService.getValidMoves(piece, row, col);
      this.highlightMoves = moves.filter(move => !board[move.row][move.col]);
      this.captureMoves = moves.filter(move => board[move.row][move.col] && board[move.row][move.col]?.color !== piece.color);
    } else {
      event.preventDefault();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, row: number, col: number) {
    this.chessBoardService.onDrop(row, col);
    this.clearHighlights();
    this.updateCurrentPlayer();
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
