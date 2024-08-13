import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {

  users: User[] = [];
  constructor(private router: Router, private userService: UserService) {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      console.log(this.users)
    });

  }
  

  user: User = {
    id: '',
    name: '',
    side: 'white',
  };

  onSubmit() {
    this.userService.setUser(this.user);
    this.router.navigate(['/menu']);
  }
}
