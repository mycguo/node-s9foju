import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import CustomApplicationModel from '../../models/custom-application-model';
import GridData from '../../../grid/models/grid-data.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import GridColumn from '../../../grid/models/grid-column.model';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import GridCheckboxColumn from '../../../grid/models/grid-checkbox-column.model';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-custom-applications-table',
  templateUrl: './custom-applications-table.component.html',
  styleUrls: ['./custom-applications-table.component.less']
})
export class CustomApplicationsTableComponent implements OnInit {

  @Input() set data(gridData: CustomApplicationModel[]) {
    this.gridData = new GridData<CustomApplicationModel>(gridData);
  }
  @Input() selectedIds: string[];
  @Input() isEditBtnDisabled = true;
  @Input() isDeleteBtnDisabled = true;
  @Input() isMoveUpBtnDisabled = true;
  @Input() isMoveDownBtnDisabled = true;
  @Input() statusBarData: GridStatusBar;

  @Output() addBtnClicked = new EventEmitter<void>();
  @Output() editBtnClicked = new EventEmitter<string>();
  @Output() deleteBtnClicked = new EventEmitter<void>();
  @Output() moveUpBtnClicked = new EventEmitter<void>();
  @Output() moveDownBtnClicked = new EventEmitter<void>();
  @Output() rowIdsSelected = new EventEmitter<string[]>();
  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() globalSearchTermChanged = new EventEmitter<string>();

  columns: GridColumn[];
  gridData: GridData<CustomApplicationModel> = new GridData<CustomApplicationModel>();

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
        name: 'Rank',
        prop: 'rankString',
        maxWidth: 75,
        cellClass: 'ag-cell_align-center',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('rankString')
      }),
      new GridColumn({
        name: 'Application Name',
        prop: 'name',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('name'),
        onCellClicked: this.handleCellClick.bind(this),
        cellClass: 'ag-cell_link'
      }),
      new GridColumn({
        name: 'IP Ranges',
        prop: 'ipRangesString',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('ipRangesString'),
        tooltipField: 'ipRangesString'
      }),
      new GridColumn({
        name: 'Port Ranges',
        prop: 'portRangesString',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('portRangesString'),
        tooltipField: 'portRangesString'
      }),
      new GridColumn({
        name: 'Layer 4 Protocol',
        prop: 'protocolsText',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('protocolsText'),
        tooltipField: 'protocolsText'
      }),
      new GridColumn({
        name: 'DSCP',
        prop: 'dscpTypesString',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('dscpTypesString'),
        tooltipField: 'dscpTypesString'
      }),
      new GridColumn({
        name: 'NBAR Applications',
        prop: 'nbarAppsString',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('nbarAppsString'),
        tooltipField: 'nbarAppsString'
      }),
      new GridColumn({
        name: 'HTTP host',
        prop: 'urlsString',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('urlsString'),
        tooltipField: 'urlsString'
      }),
      new GridColumn({
        name: 'Description',
        prop: 'description',
        filter: this.gridColumnFiltersService.buildTextColumnFilter('description'),
        tooltipField: 'description'
      })
    ];
  }

  handleRowsSelected(event): void {
    this.rowIdsSelected.emit(event.map(row => row.data?.id));
  }

  handleCellClick($event: { data: CustomApplicationModel}): void {
    this.editBtnClicked.emit($event.data.id);
  }

}
