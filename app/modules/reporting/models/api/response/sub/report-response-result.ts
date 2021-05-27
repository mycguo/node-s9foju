import ReportResult from './report-result';
import ReportRequestParameters from '../../request/sub/report-request-parameters';
import ReportInfo from '../../../report-info';
import {ReportResultState} from './report-result-state';
interface ReportResponseResult {
  parameters: ReportRequestParameters;
  reportInfo: ReportInfo;
  results: Array<ReportResult>;
  state: ReportResultState;
}

export default ReportResponseResult;
