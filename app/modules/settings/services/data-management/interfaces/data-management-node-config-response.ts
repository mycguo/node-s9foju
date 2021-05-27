import {DataManagementNodeConfigRecord} from './data-management-node-config-record';
import { NodeStates } from '../enums/node-sates.enum';

export interface DataManagementNodeConfigResponse {
  dataManagementConfigRecords: Array<DataManagementNodeConfigRecord>;
  nodeId: string;
  nodeName?: string;
  nodeState?: NodeStates;
  useAllNodesConfig?: boolean;
  volumeSize?: number;
  volumeFree?: number;
}
