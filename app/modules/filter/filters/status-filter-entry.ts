import { FilterColumn } from '../interfaces/filter-column';
import LaFilterSupportEnums from '../../../../../../project_typings/enums/laFilterSupportEnums';
import TopologyStatusEnum from '../../../../../../client/nxComponents/components/laTopologyDisplayWidget/dataModels/topologyStatusEnum';
import { FilterEntry } from '../interfaces/filter-entry';

export class StatusFilterEntry implements FilterEntry {
  buildFilter(): FilterColumn {
    return {
      id: LaFilterSupportEnums.STATUS,
      name: 'Status',
      values: [
        {id: TopologyStatusEnum.CRITICAL, name: 'Critical'},
        {id: TopologyStatusEnum.WARNING, name: 'Warning'},
        {id: TopologyStatusEnum.NORMAL, name: 'Normal'},
        {id: TopologyStatusEnum.NA, name: 'N/A'}
      ]
    };
  }
}
