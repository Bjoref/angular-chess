import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  @Input() inputType: string = 'button';
  @Input() buttonText: string = '';
  @Input() oldPc: boolean = false;
  @Input() rules: boolean = false;
  // Принимаем функцию от родителя
  @Input() parentFunction!: () => void;

  // Вызываем функцию, когда пользователь нажимает на кнопку
  callParentFunction() {
    if (this.parentFunction) {
      this.parentFunction();
    }
  }
}
