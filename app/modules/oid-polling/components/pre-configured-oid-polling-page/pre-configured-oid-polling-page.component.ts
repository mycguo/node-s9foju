import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import GridColumn from '../../../grid/models/grid-column.model';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import FilterChange from '../../../grid/components/filters/filter-change';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import { PreConfiguredOidPollingModel } from '../../services/pre-configured-oid-polling/models/pre-configured-oid-polling-model';
import { GridColumnFiltersService } from '../../../grid/services/grid-column-filters/grid-column-filters.service';

@Component({
  selector: 'nx-pre-configured-oid-polling-page',
  templateUrl: './pre-configured-oid-polling-page.component.html',
  styleUrls: ['./pre-configured-oid-polling-page.component.less']
})
export class PreConfiguredOidPollingPageComponent implements OnInit {

  @Input() set data(gridData: PreConfiguredOidPollingModel[]) {
    this.gridData = new GridData<PreConfiguredOidPollingModel>(gridData);
  }
  @Input() statusBarData: GridStatusBar;

  @Output() globalSearchTermChanged = new EventEmitter<string>();
  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() editClicked = new EventEmitter<PreConfiguredOidPollingModel>();

  columns: GridColumn[];
  gridData: GridData<PreConfiguredOidPollingModel> = new GridData<PreConfiguredOidPollingModel>();

  constructor(
    private gridColumnFiltersService: GridColumnFiltersService,
  ) { }

  ngOnInit(): void {
    this.columns = this.buildColumns();
  }

  private buildColumns(): GridColumn[] {
    return [
      new GridColumn({
        name: 'Technology',
        prop: 'pollingTypeName',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('pollingTypeName'),
        onCellClicked: this.handleCellClick.bind(this),
        cellClass: 'ag-cell_link',
        maxWidth: 386
      }),
      new GridColumn({
        name: 'OIDs',
        prop: 'oidNamesString',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('oidNamesString'),
        tooltipField: 'oidNamesString'
      }),
      new GridColumn({
        name: 'Devices',
        prop: 'deviceNamesString',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('deviceNamesString'),
        tooltipField: 'deviceNamesString'
      }),
    ];
  }

  handleCellClick($event: { data: PreConfiguredOidPollingModel}): void {
    this.editClicked.emit($event.data);
  }

}
