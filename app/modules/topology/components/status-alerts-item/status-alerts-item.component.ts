import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import StatusAlertItem from './interfaces/status-alert-item';

@Component({
  selector: 'nx-status-alerts-item',
  templateUrl: './status-alerts-item.component.html',
  styleUrls: ['./status-alerts-item.component.less']
})
export class StatusAlertsItemComponent {

  @Input() alert: StatusAlertItem;
  @Output() alertClick = new EventEmitter<string>();

  @HostListener('click')
  onAlertClick() {
    this.alertClick.emit(this.alert.alertId);
  }

  constructor() { }

}
