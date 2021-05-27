import ReportResponseSummaryField from './report-response-summary-field';
import SummaryData from './summary-data';
import SummaryChartField from './summary-chart-field';
interface ReportSummary {
  chartField: ReportResponseSummaryField;
  chartFields?: SummaryChartField;
  fields: Array<ReportResponseSummaryField>;
  summaryData: Array<SummaryData>;
  yAxisLabel?: string;
}

export default ReportSummary;
