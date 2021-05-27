import QueueReportGroupResponseJobInfo from '../../request/queue-report-group-response-job-info';

interface ReportResponseMetadata {
  additionalMetadata?: {type: string, jobInfo: QueueReportGroupResponseJobInfo};
  expirationTime: string;
  id: string;
  insertionTime: string;
  name: string;
  queueName: string;
  queuedTime: string;
  state: string;
  type: string;
  username: string;
  version: number;
  visibility: string;
  priority?: string;
}

export default ReportResponseMetadata;
