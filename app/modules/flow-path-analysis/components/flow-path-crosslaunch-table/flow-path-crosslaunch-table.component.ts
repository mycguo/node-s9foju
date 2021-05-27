import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import GridData from '../../../grid/models/grid-data.model';
import PeekDevice from '../../models/peek-device';
import FilterChange from '../../../grid/components/filters/filter-change';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import GridColumn from '../../../grid/models/grid-column.model';
import { GridColumnFiltersService } from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import LaFilterSupportEnums from '../../../../../../../project_typings/enums/laFilterSupportEnums';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PeekCellRendererComponent } from '../../../grid/components/cell-renders/peek-cell-renderer/peek-cell-renderer.component';
import { GridColumnSortService } from '../../../grid/services/grid-column-sort/grid-column-sort.service';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { FilterValue } from '../../../filter/interfaces/filter-value';

@UntilDestroy()
@Component({
  selector: 'nx-flow-path-crosslaunch-table',
  templateUrl: './flow-path-crosslaunch-table.component.html',
  styleUrls: ['./flow-path-crosslaunch-table.component.less']
})
export class FlowPathCrosslaunchTableComponent implements OnInit {

  @Input() set data(gridData: PeekDevice[]) {
    this.gridData = new GridData<PeekDevice>(gridData);
  }
  @Input() set flexFilters(flexFilters: FilterValue) {
    if (flexFilters == null) {
      return;
    }
    this.formControl.setValue(flexFilters, {emitEvent: false});
  }
  @Input() highlightIds: string[];
  @Input() filterOptions: LaFilterSupportEnums[];
  @Input() statusBarData: GridStatusBar;

  @Output() columnFilterChanged = new EventEmitter<FilterChange[]>(false);
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>(false);
  @Output() globalSearchTermChanged = new EventEmitter<string>();
  @Output() flexFilterChanged = new EventEmitter<FilterValue>();

  columns: GridColumn[];
  gridData: GridData<PeekDevice> = new GridData<PeekDevice>();

  formControl: FormControl;

  constructor(
    private gridColumnFiltersService: GridColumnFiltersService,
    private gridColumnSortService: GridColumnSortService<PeekDevice>
  ) {
    this.formControl = new FormControl();
    this.formControl.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((filterValue: FilterValue) => {
          this.flexFilterChanged.emit(filterValue);
        }
      );
  }

  ngOnInit(): void {
    this.columns = this.buildColumns();
  }

  buildColumns(): GridColumn[] {
    return [
      new GridColumn({
        name: 'Device name',
        prop: 'hostName',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('hostName')
      }),
      new GridColumn({
        name: 'Peek',
        prop: 'crosslaunchUrl',
        maxWidth: 88,
        cellRenderComponent: PeekCellRendererComponent
      }),
      new GridColumn({
        name: 'IP Address',
        prop: 'address',
        sortable: true,
        customSortFn: this.gridColumnSortService.sortIpAddresses,
        maxWidth: 100,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('address')
      }),
      new GridColumn({
        name: 'Node',
        prop: 'nodeName',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('nodeName')
      }),
      new GridColumn({
        name: 'Site',
        prop: 'site',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('site')
      }),
      new GridColumn({
        name: 'Tags',
        prop: 'tagsString',
        sortable: true,
        filter: this.gridColumnFiltersService.buildTextColumnFilter('tagsString')
      }),
    ];
  }

}
