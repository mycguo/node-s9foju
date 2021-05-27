import { LA_ALERT_SEVERITY_ENUM } from '../../../../../../../../client/nxComponents/services/laAlerting/laAlertSeverityEnum';
import { IAlertThresholdInfoBtnData } from '../../../../../../../../client/nxComponents/services/laAlerting/alertTypes.constant';

/**
 * This file should not be needed after [LD-26100] is completed
 */
export interface AlertThreshold {
  label?: string; // used to match req
  name?: string;
  units?: string;
  comparator?: string;
  inputLabel?: string;
  defaultInputLabel?: string;
  defaultInputValue?: string;
  addButtonLabel?: string;
  hideInput?: boolean;
  severity?: LA_ALERT_SEVERITY_ENUM;
  infoBtnData?: IAlertThresholdInfoBtnData;
}
