import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import { GridColumnFiltersService } from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import FilterChange from '../../../grid/components/filters/filter-change';
import GridColumn from '../../../grid/models/grid-column.model';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import CustomOidPolling from '../../services/custom-oid-polling/models/custom-oid-polling';
import { OID_PROCESSING_TYPE_OPTIONS } from '../../constants/oid-processing-type-options.const';

@Component({
  selector: 'nx-custom-oid-polling-page',
  templateUrl: './custom-oid-polling-page.component.html',
  styleUrls: ['./custom-oid-polling-page.component.less']
})
export class CustomOidPollingPageComponent implements OnInit {

  @Input() set data(gridData: CustomOidPolling[]) {
    this.gridData = new GridData<CustomOidPolling>(gridData);
  }

  @Input() selectedIds: string[];
  @Input() statusBarData: GridStatusBar;
  @Input() isEditBtnDisabled = true;
  @Input() isDeleteBtnDisabled = true;

  @Output() rowIdsSelected = new EventEmitter<string[]>();
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>(false);
  @Output() globalSearchTermChanged = new EventEmitter<string>();
  @Output() addBtnClicked = new EventEmitter<void>();
  @Output() editBtnClicked = new EventEmitter<string>();
  @Output() deleteBtnClicked = new EventEmitter<void>();

  columns: GridColumn[];
  gridData: GridData<CustomOidPolling> = new GridData<CustomOidPolling>();

  constructor(
    private gridColumnFiltersService: GridColumnFiltersService,
  ) {
  }

  ngOnInit(): void {
    this.columns = this.buildColumns();
  }

  private buildColumns(): GridColumn[] {
    return [
      new GridCheckboxColumn(),
      new GridColumn({
        name: 'Name',
        prop: 'name',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('name'),
        onCellClicked: this.handleCellClick.bind(this),
        cellClass: 'ag-cell_link'
      }),
      new GridColumn({
        name: 'OID Index',
        prop: 'oidValue',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('oidValue')
      }),
      new GridColumn({
        name: 'Units',
        prop: 'units',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('units'),
        maxWidth: 125
      }),
      new GridColumn({
        name: 'Processing Type',
        prop: 'processingTypeString',
        sortable: true,
        filter: this.gridColumnFiltersService.buildSelectColumnFilter('processingTypeString', {
          options: OID_PROCESSING_TYPE_OPTIONS
        }),
        cellClass: 'ag-cell_capitalize',
        maxWidth: 125
      }),
      new GridColumn({
        name: 'Devices',
        prop: 'deviceNamesString',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('deviceNamesString'),
        tooltipField: 'deviceNamesString',
        minWidth: 486
      }),
    ];
  }

  handleRowsSelected(event): void {
    this.rowIdsSelected.emit(event.map(row => row.data?.id));
  }

  private handleCellClick($event: { data: CustomOidPolling }): void {
    this.editBtnClicked.emit($event.data.id);
  }

}
