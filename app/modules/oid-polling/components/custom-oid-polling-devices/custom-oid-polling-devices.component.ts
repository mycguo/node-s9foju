import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import GridColumn from '../../../grid/models/grid-column.model';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import { GridColumnFiltersService } from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import CustomOidPollingDevices from '../../services/custom-oid-polling/models/custom-oid-polling-devices';
import { CommonIndents } from '../../../shared/enums/common-indents.enum';
import { GridColumnSortService } from '../../../grid/services/grid-column-sort/grid-column-sort.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { TOOLTIP_ALIGNMENT_ENUM } from '../../../shared/components/tooltip/enum/tooltip-alignment.enum';

@Component({
  selector: 'nx-custom-oid-polling-devices',
  templateUrl: './custom-oid-polling-devices.component.html',
  styleUrls: ['./custom-oid-polling-devices.component.less']
})
export class CustomOidPollingDevicesComponent implements OnInit {

  @Input() set data(gridData: CustomOidPollingDevices[]) {
    this.gridData = new GridData<CustomOidPollingDevices>(gridData);
  }

  @Input() isAllDevicesSelected: boolean;
  @Input() isNoteHidden: boolean;
  @Input() selectedIds: string[];
  @Input() statusBarData: GridStatusBar;

  @Output() allDevicesSelected = new EventEmitter<boolean>();
  @Output() rowIdsSelected = new EventEmitter<string[]>();
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>();
  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>();
  @Output() globalSearchTermChanged = new EventEmitter<string>();

  columns: GridColumn[];
  gridData: GridData<CustomOidPollingDevices> = new GridData<CustomOidPollingDevices>();
  gridBottomIndent = CommonIndents.BOTTOM_MODAL_WITH_FOOTER_OUTER_HEIGHT;

  checkboxLabel = 'All devices will be polled for this OID';
  allDevicesControl: FormControl;
  onTouched: () => void;

  tooltipAlignment = TOOLTIP_ALIGNMENT_ENUM.BOTTOM_LEFT;
  tooltipMsg = 'All devices with polling enabled will be polled for OID(s) regardless of devices MIBs';

  constructor(
    private gridColumnFiltersService: GridColumnFiltersService,
    private gridColumnSortService: GridColumnSortService,
    private fb: FormBuilder,
  ) {
    this.allDevicesControl = this.fb.control(null);
  }

  ngOnInit(): void {
    this.columns = this.buildColumns();
    this.allDevicesControl.patchValue(this.isAllDevicesSelected);
    this.allDevicesControl.valueChanges.subscribe((value: boolean) => {
      this.isAllDevicesSelected = value;
      this.allDevicesSelected.emit(value);
    });
  }

  private buildColumns(): GridColumn[] {
    return [
      new GridCheckboxColumn(),
      new GridColumn({
        name: 'Device',
        prop: 'deviceName',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('deviceName')
      }),
      new GridColumn({
        name: 'Site',
        prop: 'siteName',
        sortable: true,
        customSortFn: this.gridColumnSortService.sortStrings,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('siteName')
      }),
      new GridColumn({
        name: 'IP Address',
        prop: 'ipAddress',
        sortable: true,
        customSortFn: this.gridColumnSortService.sortIpAddresses,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('ipAddress')
      }),
      new GridColumn({
        name: 'Vendor',
        prop: 'vendor',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('vendor')
      }),
      new GridColumn({
        name: 'Model',
        prop: 'model',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('model')
      }),
      new GridColumn({
        name: 'Tags',
        prop: 'tagsString',
        sortable: true,
        customSortFn: this.gridColumnSortService.sortStrings,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('tagsString'),
        tooltipField: 'tagsString'
      }),
      new GridColumn({
        name: 'Description',
        prop: 'description',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('description'),
        tooltipField: 'description'
      }),
    ];
  }

  handleRowsSelected(event): void {
    this.rowIdsSelected.emit(event.map(row => row.data?.serial));
  }

  getIdFromDataItem(rowData: CustomOidPollingDevices): string {
    return rowData.serial;
  }

}
