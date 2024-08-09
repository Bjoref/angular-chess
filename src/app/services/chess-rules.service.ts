import { Injectable } from '@angular/core';
import { ChessPiece, Pawn, Rook, Knight, Bishop, Queen, King } from '../models/chessPieces';

@Injectable({
  providedIn: 'root',
})
export class ChessRulesService {

  getValidMoves(piece: ChessPiece, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    switch (piece.constructor) {
      case Pawn:
        return this.getPawnMoves(piece as Pawn, row, col, board);
      case Rook:
        return this.getRookMoves(piece as Rook, row, col, board);
      case Knight:
        return this.getKnightMoves(piece as Knight, row, col, board);
      case Bishop:
        return this.getBishopMoves(piece as Bishop, row, col, board);
      case Queen:
        return this.getQueenMoves(piece as Queen, row, col, board);
      case King:
        return this.getKingMoves(piece as King, row, col, board);
      default:
        return [];
    }
  }

  private getPawnMoves(pawn: Pawn, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    const direction = pawn.color === 'white' ? -1 : 1;
    const startRow = pawn.color === 'white' ? 6 : 1;
    const forwardRow = row + direction;

    if (this.isInBounds(forwardRow, col) && !board[forwardRow][col]) {
      moves.push({ row: forwardRow, col });
      // Double move from the starting position
      if (row === startRow && !board[forwardRow + direction][col]) {
        moves.push({ row: forwardRow + direction, col });
      }
    }

    // Capturing moves
    const captureCols = [col - 1, col + 1];
    for (const captureCol of captureCols) {
      if (this.isInBounds(forwardRow, captureCol) && this.isEnemyPiece(forwardRow, captureCol, pawn.color, board)) {
        moves.push({ row: forwardRow, col: captureCol });
      }
    }

    return moves;
  }

  private getRookMoves(rook: Rook, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    return this.getLinearMoves(row, col, board, [
      { rowDir: -1, colDir: 0 },
      { rowDir: 1, colDir: 0 },
      { rowDir: 0, colDir: -1 },
      { rowDir: 0, colDir: 1 }
    ]);
  }

  private getBishopMoves(bishop: Bishop, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    return this.getLinearMoves(row, col, board, [
      { rowDir: -1, colDir: -1 },
      { rowDir: -1, colDir: 1 },
      { rowDir: 1, colDir: -1 },
      { rowDir: 1, colDir: 1 }
    ]);
  }

  private getQueenMoves(queen: Queen, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    return this.getLinearMoves(row, col, board, [
      { rowDir: -1, colDir: -1 },
      { rowDir: -1, colDir: 1 },
      { rowDir: 1, colDir: -1 },
      { rowDir: 1, colDir: 1 },
      { rowDir: -1, colDir: 0 },
      { rowDir: 1, colDir: 0 },
      { rowDir: 0, colDir: -1 },
      { rowDir: 0, colDir: 1 }
    ]);
  }

  private getKingMoves(king: King, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    return this.getLinearMoves(row, col, board, [
      { rowDir: -1, colDir: -1 },
      { rowDir: -1, colDir: 1 },
      { rowDir: 1, colDir: -1 },
      { rowDir: 1, colDir: 1 },
      { rowDir: -1, colDir: 0 },
      { rowDir: 1, colDir: 0 },
      { rowDir: 0, colDir: -1 },
      { rowDir: 0, colDir: 1 }
    ], 1); // Король может двигаться только на 1 клетку
  }

  private getKnightMoves(knight: Knight, row: number, col: number, board: (ChessPiece | null)[][]): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    const knightMoves = [
      { row: -2, col: -1 }, { row: -2, col: 1 },
      { row: -1, col: -2 }, { row: -1, col: 2 },
      { row: 1, col: -2 }, { row: 1, col: 2 },
      { row: 2, col: -1 }, { row: 2, col: 1 }
    ];

    for (const move of knightMoves) {
      const newRow = row + move.row;
      const newCol = col + move.col;
      if (this.isInBounds(newRow, newCol) && !this.isAllyPiece(newRow, newCol, knight.color, board)) {
        moves.push({ row: newRow, col: newCol });
      }
    }

    return moves;
  }

  private getLinearMoves(row: number, col: number, board: (ChessPiece | null)[][], directions: { rowDir: number, colDir: number }[], maxSteps: number = 8): { row: number, col: number }[] {
    const moves: { row: number, col: number }[] = [];

    for (const { rowDir, colDir } of directions) {
      let steps = 0;
      let currentRow = row + rowDir;
      let currentCol = col + colDir;

      while (this.isInBounds(currentRow, currentCol) && steps < maxSteps) {
        const targetPiece = board[currentRow][currentCol];
        if (targetPiece) {
          if (this.isEnemyPiece(currentRow, currentCol, board[row][col]?.color ?? '', board)) {
            moves.push({ row: currentRow, col: currentCol });
          }
          break; // Если встречена фигура, движение в этом направлении прекращается
        }
        moves.push({ row: currentRow, col: currentCol });
        currentRow += rowDir;
        currentCol += colDir;
        steps++;
      }
    }

    return moves;
  }

  private isInBounds(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  private isEnemyPiece(row: number, col: number, color: string, board: (ChessPiece | null)[][]): boolean {
    const targetPiece = board[row][col];
    return !!targetPiece && targetPiece.color !== color;
  }

  private isAllyPiece(row: number, col: number, color: string, board: (ChessPiece | null)[][]): boolean {
    const targetPiece = board[row][col];
    return !!targetPiece && targetPiece.color === color;
  }
}
