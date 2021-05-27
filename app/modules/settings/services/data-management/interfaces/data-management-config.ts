import {DataManagementNodeConfigRecord} from './data-management-node-config-record';
import {DataManagementNodeConfigResponse} from './data-management-node-config-response';

export interface DataManagementConfig {
  allNodesConfig: Array<DataManagementNodeConfigRecord>;
  nodesConfig: Array<DataManagementNodeConfigResponse>;
}
