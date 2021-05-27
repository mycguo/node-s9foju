import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import GridColumn from '../../../grid/models/grid-column.model';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import {GridColumnFilterConfig} from '../../../grid/models/grid-column-filter-config';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import {RowNode} from 'ag-grid-community';
import {AlertTypeCellRendererComponent} from '../../../grid/components/cell-renders/alert-type-cell-renderer/alert-type-cell-renderer.component';
import {GridCheckMarkCellRendererComponent} from '../../../grid/components/cell-renders/grid-check-mark-cell-renderer/grid-check-mark-cell-renderer.component';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import FilterChange from '../../../grid/components/filters/filter-change';
import {TextFilterParams} from '../../../grid/components/filters/text-filter/text-filter-params';
import {SelectFilterParams} from '../../../grid/components/filters/select-filter/select-filter-params';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import { Observable, Subject } from 'rxjs';
import {GridSelectService} from '../../../grid/services/grid-select/grid-select.service';
import {SdwanAlertManagement} from '../../services/sdwan-alert-management/sdwan-alert-management';
import {TableFilter} from '../../../grid/components/filters/table-filter';
import {CommonService} from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-alert-management-sdwan-table',
  templateUrl: './alert-management-sdwan-table.component.html',
  styleUrls: ['./alert-management-sdwan-table.component.less']
})
export class AlertManagementSdwanTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() data: Array<SdwanAlertManagement>;
  @Input() statusBarData: GridStatusBar;
  @Input() isEnableBtnDisabled = true;
  @Input() isDisabledBtnDisabled = true;
  @Input() tableFilters: Array<TableFilter> = [];

  @Output() alertClicked = new EventEmitter<string>();
  @Output() enabledClicked = new EventEmitter<void>();
  @Output() disabledClicked = new EventEmitter<void>();
  @Output() rowIdsSelected = new EventEmitter<Array<string>>();
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() globalSearchTermChanged = new EventEmitter<string>();

  showContent = false;
  gridData: GridData<SdwanAlertManagement> = new GridData<SdwanAlertManagement>();
  columns: Array<GridColumn>;

  private textFilterChangeSubject: { [key: string]: Subject<TextFilterParams> } = {};
  private selectFilterChangeSubject: { [key: string]: Subject<SelectFilterParams> } = {};

  constructor(private commonService: CommonService,
              private gridColumnFiltersService: GridColumnFiltersService,
              private gridSelectService: GridSelectService) {
  }

  ngOnInit() {
    this.columns = this.buildColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.commonService.isNil(changes?.data?.currentValue)) {
      const alerts: Array<SdwanAlertManagement> = changes.data.currentValue;
      this.showContent = true;
      this.gridData = new GridData<SdwanAlertManagement>(alerts);
    }
    if (!this.commonService.isNil(changes?.tableFilters?.currentValue)) {
      const tableFilters: Array<TableFilter> = changes.tableFilters.currentValue;
      tableFilters.forEach((filter: TableFilter) => {
        const textSubject = this.textFilterChangeSubject[filter.field];
        const selectSubject = this.selectFilterChangeSubject[filter.field];
        if (textSubject !== void 0) {
          textSubject.next({filterValue: <string>filter.searchTerm});
        } else if (selectSubject !== void 0) {
          selectSubject.next({filterValue: filter.searchTerm, options: void 0}); // note void 0 for options won't empty existing options
        }
      });
    }
  }

  ngOnDestroy() {
    Object.entries(this.textFilterChangeSubject).forEach(([key, value]: [string, Subject<TextFilterParams>]) => {
      value.complete();
    });

    Object.entries(this.selectFilterChangeSubject).forEach(([key, value]: [string, Subject<SelectFilterParams>]) => {
      value.complete();
    });
  }

  buildColumns(): Array<GridColumn> {
    return [
      new GridCheckboxColumn(),
      new GridColumn({
        name: 'Alert Type',
        prop: 'name',
        minWidth: 239,
        sortable: true,
        filter: this.buildTextColumnFilter('name', <string>this.findFilter('name')),
        onCellClicked: this.handleAlertClick.bind(this),
        cellRenderComponent: AlertTypeCellRendererComponent,
        // add class js-sidebar-ignore to prevent angularjs sidebar closing on click outside it's container
        cellClass: 'ag-cell_link js-sidebar-ignore',
        tooltipField: 'name'
      }),
      new GridColumn({
        name: 'Enabled',
        prop: 'enabled',
        maxWidth: 100,
        sortable: true,
        cellRenderComponent: GridCheckMarkCellRendererComponent,
        filter: this.buildSelectColumnFilter('enabled', this.gridSelectService.getBooleanList(), this.findFilter('enabled'))
      }),
      new GridColumn({
        name: 'Sharing',
        prop: 'sharingString',
        sortable: true,
        minWidth: 250,
        filter: this.buildTextColumnFilter('sharingString', <string>this.findFilter('sharingString')),
        customSortFn: this.sharingSort
      }),
      new GridColumn({
        name: 'Description', prop: 'description', sortable: false,
        filter: this.buildTextColumnFilter('description', <string>this.findFilter('description')),
        tooltipField: 'description'
      }),
    ];
  }

  buildTextColumnFilter(field: string, filterValue: string): GridColumnFilterConfig<FilterChange, TextFilterParams> {
    this.textFilterChangeSubject[field] = new Subject<TextFilterParams>();
    return this.gridColumnFiltersService.buildTextColumnFilter(field,
      {filterValue: filterValue},
      this.textFilterChangeSubject[field].asObservable());
  }

  buildSelectColumnFilter(field: string,
                          options: Array<SelectOption>,
                          filterValue: string | number | boolean): GridColumnFilterConfig<FilterChange, SelectFilterParams> {
    this.selectFilterChangeSubject[field] = new Subject<SelectFilterParams>();
    return this.gridColumnFiltersService.buildSelectColumnFilter(field,
      {options: options, filterValue: filterValue},
      this.selectFilterChangeSubject[field].asObservable());
  }

  getIdFromDataItem(rowData: SdwanAlertManagement): string {
    return rowData.id;
  }

  handleRowsSelected(rowsSelected: Array<RowNode>): void {
    const alertIds: Array<string> = rowsSelected.map((row: RowNode) => {
      const data: SdwanAlertManagement = row.data;
      return data.id;
    });
    this.rowIdsSelected.emit(alertIds);
  }

  handleAlertClick($event: { data: SdwanAlertManagement }): void {
    this.alertClicked.emit($event.data.id);
  }

  findFilter(propertyName: string): string | number | boolean {
    return this.tableFilters.find((tf: TableFilter) => tf.field === propertyName)?.searchTerm;
  }

  /**
   * sort sharing manually as its a get in the table
   */
  sharingSort(colId: string, desc: boolean, valA: SdwanAlertManagement, valB: SdwanAlertManagement): number {
    if (desc) {
      return valB.sharingString.localeCompare(valA.sharingString);
    } else {
      return valA.sharingString.localeCompare(valB.sharingString);
    }
  }
}
