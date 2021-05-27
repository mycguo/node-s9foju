import {DataManagementTaskStatusRecord} from './data-management-task-status-record';
import {TaskStatus} from '../enums/task-status.enum';

export interface DataManagementTaskStatusResponse {
  dataManagementTaskStatusRecords: Array<DataManagementTaskStatusRecord>;
  consolidatedStatus: TaskStatus;
  meta: Object;
}
