import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import GridColumn from '../../../grid/models/grid-column.model';
import {RowNode} from 'ag-grid-community';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import GridData from '../../../grid/models/grid-data.model';
import {GridColumnFilterConfig} from '../../../grid/models/grid-column-filter-config';
import FilterChange from '../../../grid/components/filters/filter-change';
import AnalyticsPlatformMonitoredDevice from '../../../../services/analytics-platform/monitored-devices/analytics-platform-monitored-device.model';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import {BehaviorSubject} from 'rxjs';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import {TextFilterParams} from '../../../grid/components/filters/text-filter/text-filter-params';
import { CommonIndents } from '../../../shared/enums/common-indents.enum';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-live-insight-edge-device-list',
  templateUrl: './live-insight-edge-device-list.component.html',
  styleUrls: ['./live-insight-edge-device-list.component.less']
})
export class LiveInsightEdgeDeviceListComponent implements OnInit, OnDestroy, OnChanges {


  @Input() columnFilterDebounceTime = 200;
  @Input() data: GridData<AnalyticsPlatformMonitoredDevice> =
      new GridData<AnalyticsPlatformMonitoredDevice>();
  @Input() selectedDeviceIds: Array<string>;
  @Input() statusBarData: GridStatusBar;
  @Input() doesUseNxNode = true;
  @Input() isLoading = true;
  @Input() errorMessage: string;
  @Input() fullHeight: boolean;

  @Output() devicesSelected = new EventEmitter<any>();
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);

  columns: Array<GridColumn>;
  columnChangeSubject = new BehaviorSubject(null);
  gridOffsetBottom = CommonIndents.BOTTOM_CONTAINER_WITH_INNER_TABSET;

  constructor(private gridColumnFiltersService: GridColumnFiltersService) {
  }

  ngOnInit() {
    this.columns = this.buildColumns();
  }

  buildColumns(): Array<GridColumn> {
    const isColumnFiltersDisabled = this.errorMessage != null && this.errorMessage?.length > 0;
    return [
      new GridCheckboxColumn(),
      new GridColumn({ name: 'Device Name', prop: 'deviceName', minWidth: 200, sortable: true,
        filter: this.buildTextColumnFilter('deviceName', {isDisabled: isColumnFiltersDisabled}) }),
      new GridColumn({ name: 'Site', prop: 'site', minWidth: 200, sortable: true,
        filter: this.buildTextColumnFilter('site', {isDisabled: isColumnFiltersDisabled}) }),
      new GridColumn({ name: 'Region', prop: 'region', sortable: true,
        filter: this.buildTextColumnFilter('region', {isDisabled: isColumnFiltersDisabled}) }),
      new GridColumn({ name: 'Tags', prop: 'tag', sortable: true,
        filter: this.buildTextColumnFilter('tag', {isDisabled: isColumnFiltersDisabled}) }),
    ];
  }

  buildTextColumnFilter(field: string, filterParams: TextFilterParams): GridColumnFilterConfig<FilterChange, TextFilterParams> {
    return this.gridColumnFiltersService.buildTextColumnFilter(field, filterParams, this.columnChangeSubject.asObservable());
  }

  getIdFromDataItem(rowData: any) {
    return rowData.deviceSerial;
  }

  handleDevicesSelected(rowsSelected: Array<RowNode>) {
    const deviceIds = rowsSelected.map((rowNode) => rowNode.data.deviceSerial);
    this.devicesSelected.emit(deviceIds);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessage != null) {
      const columnsDisabled = this.errorMessage != null;
      this.columnChangeSubject.next({ isDisabled: columnsDisabled });
    }
  }

  ngOnDestroy(): void {
    this.columnChangeSubject.complete();
  }
}
