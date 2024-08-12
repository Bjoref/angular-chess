import { Routes } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { MenuComponent } from './menu/menu.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'game', component: ChessBoardComponent }
];
