import {ActiveState, EntityState} from '@datorama/akita';
import {DataManagementNodeConfigResponse} from './data-management-node-config-response';

export interface DataManagementNodeConfigState
  extends EntityState<DataManagementNodeConfigResponse, string>, ActiveState<string> {
}
