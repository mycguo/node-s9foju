import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import {ToString} from '../../interfaces/to-string';
import {Color} from '../../../../models/color';
import {Colorable} from '../../interfaces/colorable';

@Component({
  selector: 'nx-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.less']
})
export class ChipComponent<T extends ToString & Colorable> {
  @Input() value: T;
  @Input() color: Color;
  @Output() delete = new EventEmitter();

  @HostBinding('class.nx-chip_has_hiding-delete-btn') @Input() toggleDeleteBtn: boolean;
  @HostBinding('class') get chipColorClass(): string { return this.color.value; }
}
