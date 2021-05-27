import {SelectInput} from '../../../../../../../shared/components/form/select/models/select-input';
import ServiceNowCourierConfig from '../../../../../../../integrations/services/service-now-courier-config/models/service-now-courier-config';

export interface SelectedFieldItem {
  parentName: string;
  value: ServiceNowCourierConfig;
  selectModel: SelectInput;
}
