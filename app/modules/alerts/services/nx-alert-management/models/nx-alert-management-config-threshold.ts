import {AlertSeverity} from '../../enums/alert-severity.enum';

export default interface NxAlertManagementConfigThreshold {
  severity: AlertSeverity;
  value: number;
  enabled: boolean;
  label?: string | null; // nodeId & qos class
  units: string;
  comparator: string;
  name: string;
  timeOverMinutes?: number; // node timeOverMinutes


  // todo QOS class drop uses add button for multiple thresholds
  // maybe dynamic config object
  // inputLabel: 'Qos Class',
  // defaultInputLabel: 'Catch All Threshold',
  // defaultInputValue: 'All non-specified QoS Classes',
  // addButtonLabel: 'Add Specific QoS Class Alert'
}
