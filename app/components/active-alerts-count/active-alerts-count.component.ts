import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import AlertsSummary from '../../services/alerts/alertsSummary.model';
import * as _ from 'lodash';

@Component({
  selector: 'nx-active-alerts-count',
  templateUrl: './active-alerts-count.component.html',
  styleUrls: ['./active-alerts-count.component.less']
})
export class ActiveAlertsCountComponent implements OnInit {

  @Input() alertsSummary: AlertsSummary = new AlertsSummary();

  constructor() { }

  ngOnInit() {
  }

  onIndicatorClick(key: string) {

  }
}
