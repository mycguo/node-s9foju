import { Component, HostBinding, Input } from '@angular/core';
import { LA_SWITCHER_LIST_DIRECTION_ENUM } from './enum/la-switcher-list-direction.enum';

@Component({
  selector: 'la-switcher-list',
  styleUrls: ['./la-switcher-list.component.less'],
  template: `<ng-content></ng-content>`
})

export class LaSwitcherListComponent {
  @Input() direction: LA_SWITCHER_LIST_DIRECTION_ENUM;
  @HostBinding('class')
  get directionClass() {
    return this.direction ? `la-switcher-list_direction-${this.direction}` : '';
  }
}
