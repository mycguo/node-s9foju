import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import GridColumn from '../../../grid/models/grid-column.model';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import {GridCheckMarkCellRendererComponent} from '../../../grid/components/cell-renders/grid-check-mark-cell-renderer/grid-check-mark-cell-renderer.component';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {ReportsManagement} from '../../services/reports-management/models/reports-management';
import {GridSelectService} from '../../../grid/services/grid-select/grid-select.service';
import {ReportOwnerStatus} from '../../services/reports-management/enums/report-owner-status.enum';
import { CommonIndents } from '../../../shared/enums/common-indents.enum';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-reports-management',
  templateUrl: './reports-management.component.html',
  styleUrls: ['./reports-management.component.less']
})
export class ReportsManagementComponent implements OnInit {

  @Input() set data(gridData: ReportsManagement[]) {
    this.gridData = new GridData<ReportsManagement>(gridData);
  }
  @Input() selectedIds: string[];
  @Input() isReassignBtnDisabled = true;
  @Input() isDeleteBtnDisabled = true;
  @Input() disableGrid: boolean;
  @Input() statusBarData: GridStatusBar;

  @Output() reassignBtnClicked = new EventEmitter<string>();
  @Output() deleteBtnClicked = new EventEmitter<void>();
  @Output() rowIdsSelected = new EventEmitter<string[]>();
  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);

  columns: GridColumn[];
  gridData: GridData<ReportsManagement> = new GridData<ReportsManagement>();
  gridOffsetBottom = CommonIndents.BOTTOM_CONTAINER_WITH_CARD;

  constructor(
    private gridColumnFiltersService: GridColumnFiltersService,
    private gridSelectService: GridSelectService,
  ) {}

  ngOnInit(): void {
    this.columns = this.buildColumns();
  }

  buildColumns(): GridColumn[] {
    return [
      new GridCheckboxColumn(),
      new GridColumn({
        name: 'Report Template Name',
        prop: 'reportName',
        sortable: true,
        minWidth: 480,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('reportName'),
        onCellClicked: this.handleCellClick.bind(this),
        cellClass: 'ag-cell_link'
      }),
      new GridColumn({
        name: 'Scheduled Report',
        prop: 'isScheduled',
        maxWidth: 150,
        sortable: true,
        cellRenderComponent: GridCheckMarkCellRendererComponent,
        filter: this.gridColumnFiltersService.buildSelectColumnFilter('isScheduled', {
          options: [
            new SelectOption(true, 'Scheduled'),
            new SelectOption(false, 'Unscheduled')
          ]
        }),
      }),
      new GridColumn({
        name: 'Owner',
        prop: 'reportOwner',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('reportOwner')
      }),
      new GridColumn({
        name: 'Owner Status',
        prop: 'reportOwnerStatus',
        sortable: true,
        filter: this.gridColumnFiltersService.buildSelectColumnFilter('reportOwnerStatus', {
          options: this.getReportOwnerStatusOptions(),
          filterValue: null
        })
      })
    ];
  }

  handleRowsSelected(event): void {
    this.rowIdsSelected.emit(event.map(row => row.data?.id));
  }

  handleCellClick($event: { data: ReportsManagement}): void {
    this.reassignBtnClicked.emit($event.data.id);
  }

  private getReportOwnerStatusOptions(): SelectOption[] {
    return Object.values(ReportOwnerStatus).map(option => (new SelectOption(option, option)));
  }

}
