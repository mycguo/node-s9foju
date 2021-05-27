import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import GridColumn from '../../../grid/models/grid-column.model';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import ApplicationGroup from '../../models/application-group';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-application-groups-table',
  templateUrl: './application-groups-table.component.html',
  styleUrls: ['./application-groups-table.component.less']
})
export class ApplicationGroupsTableComponent implements OnInit {

  @Input() set data(gridData: ApplicationGroup[]) {
    this.gridData = new GridData<ApplicationGroup>(gridData);
  }
  @Input() selectedIds: string[];
  @Input() isEditBtnDisabled = true;
  @Input() isDeleteBtnDisabled = true;
  @Input() statusBarData: GridStatusBar;

  @Output() addBtnClicked = new EventEmitter<void>();
  @Output() editBtnClicked = new EventEmitter<string>();
  @Output() deleteBtnClicked = new EventEmitter<void>();
  @Output() rowIdsSelected = new EventEmitter<string[]>();
  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() globalSearchTermChanged = new EventEmitter<string>();

  columns: GridColumn[];
  gridData: GridData<ApplicationGroup> = new GridData<ApplicationGroup>();

  constructor(
    private gridColumnFiltersService: GridColumnFiltersService,
  ) { }

  ngOnInit(): void {
    this.columns = this.buildColumns();
  }

  buildColumns(): GridColumn[] {
    return [
      new GridCheckboxColumn(),
      new GridColumn({
        name: 'Application Group',
        prop: 'name',
        sortable: true,
        maxWidth: 480,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('name'),
        onCellClicked: this.handleCellClick.bind(this),
        cellClass: 'ag-cell_link'
      }),
      new GridColumn({
        name: 'Applications',
        prop: 'applicationsString',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('applicationsString'),
        tooltipField: 'applicationsString'
      })
    ];
  }

  handleRowsSelected(event): void {
    this.rowIdsSelected.emit(event.map(row => row.data?.id));
  }

  handleCellClick($event: { data: ApplicationGroup}): void {
    this.editBtnClicked.emit($event.data.id);
  }
}
