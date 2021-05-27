import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { SPINNER_SIZE } from '../spinner/spinnerSize';

/**
 * @description port of AngularJS la-updating-data-message component
 */
@Component({
  selector: 'nx-updating-data-message',
  templateUrl: './updating-data-message.component.html',
  styleUrls: ['./updating-data-message.component.less']
})
export class UpdatingDataMessageComponent implements OnInit {

  @Input() message: string;
  @Input() cancelTitle: string;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  SPINNER_SIZE = SPINNER_SIZE;

  constructor() { }

  ngOnInit(): void {
  }

}
