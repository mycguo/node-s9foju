import ReportDrillDowns from './report-drill-downs';
import ReportSummary from './summary/report-summary';
import ReportResponseTimeSeries from './time-series/report-response-time-series';
import ReportViewModeParameter from '../../parameter-enums/report-view-mode-parameter';
import ReportKey from './report-key';
import ReportResultError from './report-result-error';
import {ReportMetadataType} from './report-metadata-type';

interface ReportResult {
  drillDowns?: ReportDrillDowns;
  reportKeys?: Array<ReportKey>;
  state?: string;
  summary?: ReportSummary;
  yAxisLabel?: string;
  contentType?: ReportViewModeParameter;
  timeSeries?: ReportResponseTimeSeries;
  metadata?: ReportMetadataType;
  error?: ReportResultError;
}

export default ReportResult;
