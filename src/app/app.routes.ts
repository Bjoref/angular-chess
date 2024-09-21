import { Routes } from '@angular/router';
import { ChessBoardComponent } from './components/chess-board/chess-board.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';
import { RulesPageComponent } from './pages/rules-page/rules-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'rules', component: RulesPageComponent },
  { path: 'game', component: ChessBoardComponent, canActivate: [AuthGuard] }
];
