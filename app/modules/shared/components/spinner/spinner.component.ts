import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SPINNER_SIZE} from './spinnerSize';
import {SPINNER_POSITION} from './spinnerPosition';

@Component({
  selector: 'nx-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent implements OnInit {
  @Input() spinnerSize = SPINNER_SIZE.MD;
  @Input() spinnerPosition: SPINNER_POSITION;
  @Input() spinnerOverlay: boolean;
  @HostBinding('class.nx-spinner_fill-content-area') @Input() fillContentArea: boolean;
  @HostBinding('class') get size(): string {
    return `nx-spinner_size_${this.spinnerSize}`;
  }
  isIeDetected: boolean;
  readonly spinnerSizes = SPINNER_SIZE;
  readonly spinnerPositions = SPINNER_POSITION;

  constructor() { }

  ngOnInit() {
    this.isIeDetected = navigator.userAgent.indexOf('Trident/7.0') > -1;
  }

}
