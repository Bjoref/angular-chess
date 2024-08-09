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
  constructor(public color: 'white' | 'black', public position: { row: number; col: number }) {}
}

//Ладья
export class Rook implements ChessPiece {
  type = 'rook';
  constructor(public color: 'white' | 'black', public position: { row: number; col: number }) {}
}

//Конь
export class Knight implements ChessPiece {
  type = 'knight';
  constructor(public color: 'white' | 'black', public position: { row: number; col: number }) {}
}

//Слон
export class Bishop implements ChessPiece {
  type = 'bishop';
  constructor(public color: 'white' | 'black', public position: { row: number; col: number }) {}
}

//Королева
export class Queen implements ChessPiece {
  type = 'queen';
  constructor(public color: 'white' | 'black', public position: { row: number; col: number }) {}
}

//Король 
export class King implements ChessPiece {
  type = 'king';
  constructor(public color: 'white' | 'black', public position: { row: number; col: number }) {}
}
