import {ThresholdComponentOption} from '../../../components/side-bar/thresholds/threshold-component-option.enum';
import NxAlertManagementConfigThreshold from './nx-alert-management-config-threshold';

export default interface NxAlertManagementConfig {
  thresholdComponent: ThresholdComponentOption;
  thresholds: Array<NxAlertManagementConfigThreshold>;
  timeOverMinutes?: number;
  filter?: {
    flexString: string;
  };
}
