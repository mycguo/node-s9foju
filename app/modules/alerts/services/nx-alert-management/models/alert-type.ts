import {AlertTypes} from '../enums/alert-types.enum';
import {AlertThreshold} from './alert-threshold';
import {ThresholdComponentOption} from '../../../components/side-bar/thresholds/threshold-component-option.enum';
import { IAlertThresholdAutomaticResolutionNoteData } from '../../../../../../../../client/nxComponents/services/laAlerting/alertTypes.constant';

/**
 * This should be modified after [LD-26100] is completed
 */
export interface AlertType {
  id: AlertTypes;
  thresholds?: AlertThreshold[];
  isMultiThreshold?: boolean;
  contributesToStatus?: boolean;
  advanced?: boolean;
  singleThresholdMultiNode?: boolean;
  isHierarchical?: boolean; // Hierarchical alerts flag
  validFilters?: any[]; // TODO LaFilterSupportEnums
  thresholdComponent?: ThresholdComponentOption;
  automaticResolutionNoteData?: IAlertThresholdAutomaticResolutionNoteData;
}
