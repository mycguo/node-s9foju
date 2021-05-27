import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import {ModalSize} from '../../../shared/components/modal-container/modal-size.enum';
import AnalyticsPlatformMonitoredDevice from '../../../../services/analytics-platform/monitored-devices/analytics-platform-monitored-device.model';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {DisplayError} from '../../../shared/components/loading/enums/display-error.enum';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-live-insight-edge-add-device-modal',
  templateUrl: './live-insight-edge-add-device-modal.component.html',
  styleUrls: ['./live-insight-edge-add-device-modal.component.less']
})
export class LiveInsightEdgeAddDeviceModalComponent implements OnInit, OnChanges {

  @Input() devices: GridData<AnalyticsPlatformMonitoredDevice> =
    <GridData<AnalyticsPlatformMonitoredDevice>>{ rows: [] };
  @Input() addButtonActive = false;
  @Input() errorMessage: string;
  @Input() requestError: SimpleAlert;
  @Input() isAvailableDevicesLoading = true;
  @Input() selectedDeviceIds: Array<string>;
  @Input() statusBarData: GridStatusBar;

  @Output() cancelModal = new EventEmitter();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Output() devicesSelected = new EventEmitter<Array<string>>();
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>();
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>();
  @Output() addSelectedDevices = new EventEmitter();

  ModalSize = ModalSize;
  errorDisplayType = DisplayError.BOTTOM;
  addDeviceErrorMessage: DetailedError;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes?.requestError?.currentValue != null) {
      this.addDeviceErrorMessage = new DetailedError(this.requestError.title, this.requestError.message);
    }
  }

}
