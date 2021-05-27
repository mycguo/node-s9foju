import {ReportTableDataGeneratorOptions} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator-options';
import {DashboardWidgetDeviceVisualOptions} from '../../components/live-insight-edge-summary/dashboard-widget-device-visual-options';
import {ReportTableDataGeneratorOptionsColumn} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator-options-column';

export interface InsightSummaryWidgetOptions extends
  ReportTableDataGeneratorOptions<ReportTableDataGeneratorOptionsColumn>, DashboardWidgetDeviceVisualOptions {}
