import {Component, EventEmitter, Input, Output} from '@angular/core';
import { LaNoDataMessage } from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import GridData from '../../../grid/models/grid-data.model';
import {DashboardWidgetFilteredTableConfig} from './dashboard-widget-filtered-table-config';

@Component({
  selector: 'nx-dashboard-widget-filtered-table',
  templateUrl: './dashboard-widget-filtered-table.component.html',
  styleUrls: ['./dashboard-widget-filtered-table.component.less']
})
export class DashboardWidgetFilteredTableComponent {
  @Input() data: GridData<{ [key: string]: string }>;
  @Input() config: DashboardWidgetFilteredTableConfig;

  @Output() columnFilterChanged = new EventEmitter<Array<FilterChange>>();
  @Output() columnSortChanged = new EventEmitter<GridColumnSort>();
  @Output() globalSearchChanged = new EventEmitter<string>();

  globalSearch = '';
  noDataMessage: LaNoDataMessage;

  constructor() {
    this.noDataMessage = new LaNoDataMessage('No Data');
  }

}
