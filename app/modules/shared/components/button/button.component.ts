import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'nx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent {
  @Input() isSubmit = false;
  @Input() isPrimary = false;
  @Input() icon?: string;
  @Input() iconPos?: string;
  @Input() isWhiteViewMode = false;
  @Input() isDisabled = false;

  @Output() btnClick = new EventEmitter();

  buttonClick(): void {
    this.btnClick.emit();
  }
}
