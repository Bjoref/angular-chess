import { Component, Input } from '@angular/core';
import { SelectValue } from '../../../models/ui';

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [],
  templateUrl: './ui-select.component.html',
  styleUrl: './ui-select.component.scss'
})
export class UiSelectComponent {
  @Input() userId: string = '';
  @Input() selectName: string = '';
  @Input() formControlName: string = '';
  @Input() labelText: string = '';
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() values: SelectValue[] = [];

}
