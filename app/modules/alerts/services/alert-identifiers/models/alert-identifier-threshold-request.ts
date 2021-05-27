import {AlertSeverity} from '../../enums/alert-severity.enum';

export interface AlertIdentifierThresholdRequest {
  severity: AlertSeverity;
  value: number;
  enabled: boolean;
  timeOverMinutes?: number;
}
