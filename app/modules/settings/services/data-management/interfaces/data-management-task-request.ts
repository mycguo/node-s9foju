import {TaskAction} from '../enums/task-action.enum';
import {DataStoreType} from '../enums/data-store-type.enum';

export interface DataManagementTaskRequest {
  action: TaskAction;
  dataStoreType: DataStoreType;
  nodeIds: Array<string>;
  backupDirectoryPath?: string;
  purgeAge?: number;
}
