import {QueueReportGroupRequest} from '../../../reporting/models/api/request/queue-report-group-request';

/**
 * Encapsulates a report request from a dashboard. Users of this request should be able to support
 * multiple visual elements made from a single report.
 */
export interface DashboardDataRequest <T = QueueReportGroupRequest> {
  /**
   * Key for the request.
   */
  requestKey: string;
  reportRequest: T;
}
