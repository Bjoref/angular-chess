import { Routes } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { MenuComponent } from './menu/menu.component';
import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'game', component: ChessBoardComponent }
];
