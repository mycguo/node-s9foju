import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';

/**
 * DEPRECATED use form toggle component
 */
@Component({
  selector: 'nx-custom-text-toggle',
  templateUrl: './custom-text-toggle.component.html',
  styleUrls: ['./custom-text-toggle.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CustomTextToggleComponent implements OnInit {

  @Input() option1: string;
  @Input() option2: string;
  @Input() isOption1: boolean;
  @Input() toggleLabel: string;

  @Output() valueChanged = new EventEmitter<boolean>();

  id = _.uniqueId('nx-custom-text-toggle_');
  isChecked: boolean;

  constructor() { }

  ngOnInit() {
  }

  handleCheckboxChange(isChecked: boolean) {
    this.valueChanged.emit(isChecked);
  }

}
