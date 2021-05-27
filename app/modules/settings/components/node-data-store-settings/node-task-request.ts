import {TaskTypes} from '../../services/data-management/enums/task-types.enum';
import {DataStoreType} from '../../services/data-management/enums/data-store-type.enum';

export interface NodeTaskRequest {
  taskType: TaskTypes;
  dataStoreType: DataStoreType;
  nodeId: string;
}
