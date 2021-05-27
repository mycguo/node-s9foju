import {TaskStatus} from '../enums/task-status.enum';
import {DataStoreType} from '../enums/data-store-type.enum';

export interface DataManagementTaskStatusRecord {
  jobStatus: TaskStatus;
  nodeName: string;
  nodeId: string;
  dataStoreType: DataStoreType;
  exception?: string;
}
