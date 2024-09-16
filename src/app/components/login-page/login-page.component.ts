import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { GameService } from '../../services/game.service';
import { UiSelectComponent } from '../ui/ui-select/ui-select.component';
import { UiButtonComponent } from '../ui/ui-button/ui-button.component';
import { UserPanelComponent } from '../user-panel/user-panel.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UiSelectComponent, UiButtonComponent, UserPanelComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  @Output() userId: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder, private gameService: GameService) {
    this.form = this.fb.group({
      id: [{value: '', disabled: false}]  // Управление состоянием disabled здесь
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const userId = this.form.get('id')?.value;

    // Загружаем пользователя по ID и сохраняем в сервисе
    this.userService.loadUserById(userId).subscribe(user => {
      if (user) {
        this.gameService.setCurrentColor(user.side)
        this.userId.emit(userId);  // Передаем userId в EventEmitter
        this.router.navigate(['/menu']);  // Переход на следующую страницу
      } else {
        alert('User not found');
      }
    });
  }
}
