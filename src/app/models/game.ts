import { User } from "./user";

export interface Game {
  id: string;
  status: string;
  players: User[];
}
