import {Injectable} from '@angular/core';
import {SimpleFilterService} from '../../../../services/table-filter/simple-filter.service';
import {DashboardWidgetTableStore} from '../../stores/dashboard-widget-table/dashboard-widget-table.store';
import {DashboardWidgetTableQuery} from '../../stores/dashboard-widget-table/dashboard-widget-table.query';
import {DashboardWidgetTableState} from '../../stores/dashboard-widget-table/dashboard-widget-table-state';

@Injectable({
  providedIn: 'root'
})
export class DashboardWidgetTableService extends SimpleFilterService<DashboardWidgetTableState, { [key: string]: string }> {

  constructor(
    private store: DashboardWidgetTableStore,
    protected query: DashboardWidgetTableQuery
  ) {
    super(query);
  }

  updateStore(data: Array<{ [key: string]: string }>): void {
    this.store.set(data);
  }

  reset(): void {
    this.store.reset();
  }
}
