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
import AlertManagementAlert from '../../services/models/alert-management-alert';
import {SeverityCellRendererComponent} from '../../../grid/components/cell-renders/severity-cell-renderer/severity-cell-renderer.component';
import {AlertTypeCellRendererComponent} from '../../../grid/components/cell-renders/alert-type-cell-renderer/alert-type-cell-renderer.component';
import {GridCheckMarkCellRendererComponent} from '../../../grid/components/cell-renders/grid-check-mark-cell-renderer/grid-check-mark-cell-renderer.component';
import NxAlertManagement from '../../services/nx-alert-management/models/nx-alert-management';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import FilterChange from '../../../grid/components/filters/filter-change';
import {TextFilterParams} from '../../../grid/components/filters/text-filter/text-filter-params';
import {SelectFilterParams} from '../../../grid/components/filters/select-filter/select-filter-params';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {Subject} from 'rxjs';
import {GridSelectService} from '../../../grid/services/grid-select/grid-select.service';
import {ALERT_CATEGORIES} from '../../services/nx-alert-management/enums/alert-categories.enum';
import {AlertSeverity} from '../../services/enums/alert-severity.enum';
import {NxAlertManagementHierarchical} from '../../services/nx-alert-management/models/nx-alert-management-hierarchical';
import {TableFilter} from '../../../grid/components/filters/table-filter';
import {CommonService} from '../../../../utils/common/common.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-alert-management-table',
  templateUrl: './alert-management-nx-table.component.html',
  styleUrls: ['./alert-management-nx-table.component.less']
})
export class AlertManagementNxTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() data: Array<NxAlertManagement>;
  @Input() selectedAlertIds: Array<string>;
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
  gridData: GridData<NxAlertManagement> = new GridData<NxAlertManagement>();
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
    if (!this.commonService.isNil(changes?.data)) {
      const alerts: Array<NxAlertManagement> = changes.data.currentValue;
      this.showContent = true;
      this.gridData = new GridData<NxAlertManagement>(alerts);
    }

    if (!this.commonService.isNil(changes?.tableFilters?.currentValue)) {
      const tableFilters: Array<TableFilter> = changes.tableFilters.currentValue;
      tableFilters.forEach((filter: TableFilter) => {
        const textSubject = this.textFilterChangeSubject[filter.field];
        if (textSubject !== void 0) {
          textSubject.next({filterValue: <string>filter.searchTerm});
        }
        const selectSubject = this.selectFilterChangeSubject[filter.field];
        if (selectSubject !== void 0) {
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
      }),
      new GridColumn({
        name: 'Category',
        prop: 'displayCategory',
        minWidth: 239,
        sortable: true,
        filter: this.buildSelectColumnFilter('displayCategory', this.getCategoryOptions(), this.findFilter('displayCategory'))
      }),
      new GridColumn({
        name: 'Severity',
        prop: 'severity',
        maxWidth: 125,
        sortable: true,
        cellRenderComponent: SeverityCellRendererComponent,
        filter: this.buildSelectColumnFilter('severity', this.getSeverityOptions(), this.findFilter('severity')),
        customSortFn: this.severitySort
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
        name: 'Thresholds', prop: 'thresholdString', sortable: false,
        filter: this.buildTextColumnFilter('thresholdString', <string>this.findFilter('thresholdString')),
        tooltipField: 'thresholdString'
      }),
      new GridColumn({
        name: 'Sharing',
        prop: 'sharingString',
        sortable: true,
        filter: this.buildTextColumnFilter('sharingString', <string>this.findFilter('sharingString')),
        customSortFn: this.sharingSort
      })
    ];
  }

  getCategoryOptions(): Array<SelectOption> {
    return [
      new SelectOption(ALERT_CATEGORIES.APPLICATION, ALERT_CATEGORIES.APPLICATION),
      new SelectOption(ALERT_CATEGORIES.DEVICE_INTERFACE, ALERT_CATEGORIES.DEVICE_INTERFACE),
      new SelectOption(ALERT_CATEGORIES.NETWORK, ALERT_CATEGORIES.NETWORK),
      new SelectOption(ALERT_CATEGORIES.SYSTEM, ALERT_CATEGORIES.SYSTEM),
    ];
  }

  getSeverityOptions(): Array<SelectOption> {
    return [
      new SelectOption(AlertSeverity.CRITICAL, 'Critical'),
      new SelectOption(AlertSeverity.WARNING, 'Warning'),
      new SelectOption(AlertSeverity.INFO, 'Info'),
      new SelectOption(AlertSeverity.MULTIPLE, 'Multiple')
    ];
  }

  isRowSelectable = function (rowNode: RowNode) {
    const rowData: NxAlertManagement | NxAlertManagementHierarchical = rowNode.data;
    return (rowData !== void 0 && !(rowData instanceof NxAlertManagementHierarchical));
  };

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

  severitySort(colId: string, desc: boolean, valA: NxAlertManagement, valB: NxAlertManagement): number {
    const severityHierarchy = [AlertSeverity.CRITICAL, AlertSeverity.WARNING, AlertSeverity.INFO, AlertSeverity.MULTIPLE];
    const indexA = severityHierarchy.indexOf(valA[colId]);
    const indexB = severityHierarchy.indexOf(valB[colId]);
    if (desc) {
      return indexB - indexA;
    } else {
      return indexA - indexB;
    }
  }

  getIdFromDataItem(rowData: AlertManagementAlert): string {
    return rowData.id;
  }

  handleRowsSelected(rowsSelected: Array<RowNode>): void {
    const alertIds: Array<string> = rowsSelected.map((row: RowNode) => {
      const data: AlertManagementAlert = row.data;
      return data.id;
    });
    this.rowIdsSelected.emit(alertIds);
  }

  handleAlertClick($event: { data: AlertManagementAlert }): void {
    this.alertClicked.emit($event.data.id);
  }

  findFilter(propertyName: string): string | number | boolean {
    return this.tableFilters.find((tf: TableFilter) => tf.field === propertyName)?.searchTerm;
  }

  /**
   * sort sharing manually as its a get in the table
   */
  sharingSort(colId: string, desc: boolean, valA: NxAlertManagement, valB: NxAlertManagement): number {
    if (desc) {
      return valB.sharingString.localeCompare(valA.sharingString);
    } else {
      return valA.sharingString.localeCompare(valB.sharingString);
    }
  }
}
