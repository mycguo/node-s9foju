import { StatusIndicatorValues } from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import AnalyticsPlatformConfig from '../../../../services/analytics-platform/config/analytics-platform-config';
import {SPINNER_SIZE} from '../../../shared/components/spinner/spinnerSize';

@Component({
  selector: 'nx-live-insight-edge-config-display',
  templateUrl: './live-insight-edge-config-display.component.html',
  styleUrls: ['./live-insight-edge-config-display.component.less']
})
export class LiveInsightEdgeConfigDisplayComponent implements OnInit {

  @Input() data: AnalyticsPlatformConfig;
  @Input() connectionStatus: StatusIndicatorValues = StatusIndicatorValues.OFFLINE;
  @Input() version: string;
  @Input() isCheckingConnection = true;

  SPINNER_SIZE = SPINNER_SIZE;

  constructor() { }

  ngOnInit() {
  }

}
