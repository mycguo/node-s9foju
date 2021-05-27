import ReportResponseMeta from './sub/report-response-meta';
import ReportResponseMetadata from './sub/report-response-metadata';
import ReportResponseResult from './sub/report-response-result';

interface ReportResponse {
  meta: ReportResponseMeta;
  metadata: ReportResponseMetadata;
  results: Array<ReportResponseResult>;
}

export default ReportResponse;
