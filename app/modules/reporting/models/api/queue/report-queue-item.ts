import {ReportPriority} from '../request/enums/report-priority';
import {ReportQueueState} from '../../enums/report-queue-state';

export interface ReportQueueItem {
  id: string;
  name: string;
  priority: ReportPriority;
  status: ReportQueueState;
  time: string; // ISO
  scheduleGroupInfo?: any;
  timeDisplayNameFormat?: string;
  hideCancelButton?: boolean;
  hideDeleteButton?: boolean;
}

