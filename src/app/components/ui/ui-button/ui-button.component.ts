import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  @Input() inputType: string = 'button';
  @Input() buttonText: string = '';
  // Принимаем функцию от родителя
  @Input() parentFunction!: () => void;

  // Вызываем функцию, когда пользователь нажимает на кнопку
  callParentFunction() {
    if (this.parentFunction) {
      this.parentFunction();
    }
  }
}
