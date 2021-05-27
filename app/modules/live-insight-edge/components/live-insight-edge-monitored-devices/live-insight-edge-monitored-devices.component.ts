import {Component, EventEmitter, Input,  OnDestroy, OnInit, Output} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import AnalyticsPlatformMonitoredDevice from '../../../../services/analytics-platform/monitored-devices/analytics-platform-monitored-device.model';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-live-insight-edge-monitored-devices',
  templateUrl: './live-insight-edge-monitored-devices.component.html',
  styleUrls: ['./live-insight-edge-monitored-devices.component.less']
})
export class LiveInsightEdgeMonitoredDevicesComponent implements OnInit, OnDestroy {

  @Input() deviceList: GridData<AnalyticsPlatformMonitoredDevice> =
      <GridData<AnalyticsPlatformMonitoredDevice>> { rows: [] };
  @Input() selectedDeviceIds: Array<string>;
  @Input() statusBarData: GridStatusBar;
  @Input() deleteButtonActive = false;
  @Input() importSnmpButtonActive = false;
  @Input() importSnmpTaskLoading = false;
  @Input() isMonitoredDevicesLoading = true;
  @Input() errorMessage: string;

  @Output() searchTermChanged = new EventEmitter<string>(false);
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() devicesSelected = new EventEmitter<Array<string>>(false);
  @Output() addDevicesClicked = new EventEmitter();
  @Output() deleteDevicesClicked = new EventEmitter();
  @Output() importSnmpClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  addDevicesBtnClick() {
    this.addDevicesClicked.emit();
  }

  importSnmpBtnClick() {
    this.importSnmpClicked.emit();
  }

  handleDeviceSelection(rowIdsSelected: Array<string>) {
    this.devicesSelected.emit(rowIdsSelected);
  }


  ngOnDestroy(): void {
  }


}
