import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numbers]',
  standalone: true  // Делаем директиву автономной
})
export class NumbersDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const initialValue = input.value;

    // Удаляем все символы, кроме цифр
    const newValue = initialValue.replace(/[^0-9]/g, '');

    if (newValue !== initialValue) {
      // Обновляем значение в контроле формы без эмитирования события
      this.ngControl.control?.setValue(newValue, { emitEvent: false });
    }
  }
}
