import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  @Output() userId: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: ''
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const userId = this.form.get('id')?.value;

    // Загружаем пользователя по ID и сохраняем в сервисе
    this.userService.loadUserById(userId).subscribe(user => {
      if (user) {
        this.userId.emit(userId);  // Передаем userId в EventEmitter
        this.router.navigate(['/menu']);  // Переход на следующую страницу
      } else {
        alert('User not found');
      }
    });
  }
}
