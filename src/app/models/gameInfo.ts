export interface GameInfo {
  id: number;
  whitePlayerToken: string;
  blackPlayerToken: string;
  gamePgn: string;
  gameAscii: string;
  turn: 'w' | 'b'; // 'w' для белых, 'b' для черных
  startDateTime: string; // ISO дата-время
}