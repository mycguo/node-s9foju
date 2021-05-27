import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import GridColumn from '../../../grid/models/grid-column.model';
import {BehaviorSubject} from 'rxjs';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import {TextFilterParams} from '../../../grid/components/filters/text-filter/text-filter-params';
import {GridColumnFilterConfig} from '../../../grid/models/grid-column-filter-config';
import {RowNode} from 'ag-grid-community';
import {AnalyticsPlatformMonitoredAppGroup} from '../../../../services/analytics-platform/monitored-app-group/analytics-platform-monitored-app-group';
import { CommonIndents } from '../../../shared/enums/common-indents.enum';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-live-insight-edge-application-group-list',
  templateUrl: './live-insight-edge-application-group-list.component.html',
  styleUrls: ['./live-insight-edge-application-group-list.component.less']
})
export class LiveInsightEdgeApplicationGroupListComponent  implements OnInit, OnDestroy, OnChanges {


  @Input() columnFilterDebounceTime = 200;
  @Input() data: GridData<AnalyticsPlatformMonitoredAppGroup> =
    new GridData<AnalyticsPlatformMonitoredAppGroup>();
  @Input() selectedAppGroupIds: Array<string>;
  @Input() isLoading = true;
  @Input() errorMessage: string;
  @Input() fullHeight: boolean;
  @Input() offsetBottom: CommonIndents;
  @Input() statusBarData: GridStatusBar;

  @Output() appGroupsSelected = new EventEmitter<any>();
  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);

  columns: Array<GridColumn>;
  columnChangeSubject = new BehaviorSubject(null);

  constructor(private gridColumnFiltersService: GridColumnFiltersService) {
  }

  ngOnInit() {
    this.columns = this.buildColumns();
  }

  buildColumns(): Array<GridColumn> {
    const isColumnFiltersDisabled = this.errorMessage == null || this.errorMessage.length > 0;
    return [
      new GridCheckboxColumn(),
      new GridColumn({
        name: 'Application Group',
        prop: 'name',
        maxWidth: 480,
        sortable: true,
        filter: this.buildTextColumnFilter('name', {isDisabled: isColumnFiltersDisabled})
      }),
      new GridColumn({
        name: 'Applications',
        prop: 'applications',
        sortable: true,
        filter: this.buildTextColumnFilter('applications', {isDisabled: isColumnFiltersDisabled}),
        tooltipField: 'applications'
      }),
    ];
  }

  buildTextColumnFilter(field: string, filterParams: TextFilterParams): GridColumnFilterConfig<FilterChange, TextFilterParams> {
    return this.gridColumnFiltersService.buildTextColumnFilter(field, filterParams, this.columnChangeSubject.asObservable());
  }

  getIdFromDataItem(rowData: any) {
    return rowData.id;
  }

  handleAppGroupSelected(rowsSelected: Array<RowNode>) {
    const appGroupIds = rowsSelected.map((rowNode) => rowNode.data.id);
    this.appGroupsSelected.emit(appGroupIds);
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
