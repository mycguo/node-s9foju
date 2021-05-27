import {DashboardWidgetTableConfig} from '../dashboard-widget-table/dashboard-widget-table-config';

export interface DashboardWidgetFilteredTableConfig extends DashboardWidgetTableConfig {
  hideGlobalSearch?: boolean;
  filterableColumns?: Array<string>; // columns that should be filterable by global table search
}
