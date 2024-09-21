import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './rules-page.component.html',
  styleUrl: './rules-page.component.scss'
})
export class RulesPageComponent {

  constructor(
    private router: Router,
  ) {
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
