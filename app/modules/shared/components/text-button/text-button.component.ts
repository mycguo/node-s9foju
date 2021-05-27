import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'nx-text-button',
  templateUrl: './text-button.component.html',
  styleUrls: ['./text-button.component.less']
})
export class TextButtonComponent {
  @Input() isDisabled = false;
  @Output() btnClick = new EventEmitter<Event>();
}
