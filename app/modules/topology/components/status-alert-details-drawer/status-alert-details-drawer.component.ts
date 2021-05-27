import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Details} from './models/details/details';
import StatusAlertItem from '../status-alerts-item/interfaces/status-alert-item';
import {StatusAlertDetailsService} from '../../services/status-alert-details/status-alert-details.service';

@Component({
  selector: 'nx-status-alert-details-drawer',
  templateUrl: './status-alert-details-drawer.component.html',
  styleUrls: ['./status-alert-details-drawer.component.less']
})
export class StatusAlertDetailsDrawerComponent implements OnInit {
  detailsData: Details;
  @Input() details: StatusAlertItem;
  @Output() closeDrawer = new EventEmitter<void>();

  constructor(private statusAlertDetailsService: StatusAlertDetailsService) {}

  ngOnInit(): void {
    this.detailsData = this.statusAlertDetailsService.getTransformedData(this.details);
  }

  onCloseDrawer(): void {
    this.closeDrawer.emit();
  }
}
