export interface ChessPiece {
  type: string; // Тип фигуры (король, ферзь, ладья и т.д.)
  color: 'white' | 'black'; // Цвет фигуры
  position: {
    row: number; // Строка на доске
    col: number; // Колонка на доске
  };
}

//Пешка
export class Pawn implements ChessPiece {
  type = 'pawn';
  constructor(
    public color: 'white' | 'black',
    public position: { row: number; col: number }
  ) {}
}

//Ладья
export class Rook implements ChessPiece {
  type = 'rook';
  constructor(
    public color: 'white' | 'black',
    public position: { row: number; col: number }
  ) {}
}

//Конь
export class Knight implements ChessPiece {
  type = 'knight';
  constructor(
    public color: 'white' | 'black',
    public position: { row: number; col: number }
  ) {}
}

//Слон
export class Bishop implements ChessPiece {
  type = 'bishop';
  constructor(
    public color: 'white' | 'black',
    public position: { row: number; col: number }
  ) {}
}

//Королева
export class Queen implements ChessPiece {
  type = 'queen';
  constructor(
    public color: 'white' | 'black',
    public position: { row: number; col: number }
  ) {}
}

//Король
export class King implements ChessPiece {
  type = 'king';
  constructor(
    public color: 'white' | 'black',
    public position: { row: number; col: number }
  ) {}
}

export class ChessPieceFactory {
  static createPieceFromAscii(char: string, position: { row: number; col: number }): ChessPiece | null {
    switch (char) {
      case 'P': return new Pawn('white', position);
      case 'p': return new Pawn('black', position);
      case 'R': return new Rook('white', position);
      case 'r': return new Rook('black', position);
      case 'N': return new Knight('white', position);
      case 'n': return new Knight('black', position);
      case 'B': return new Bishop('white', position);
      case 'b': return new Bishop('black', position);
      case 'Q': return new Queen('white', position);
      case 'q': return new Queen('black', position);
      case 'K': return new King('white', position);
      case 'k': return new King('black', position);
      default: return null; // Пустая клетка
    }
  }
}