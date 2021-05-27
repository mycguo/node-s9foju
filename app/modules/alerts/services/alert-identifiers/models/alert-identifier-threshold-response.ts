import {AlertSeverity} from '../../enums/alert-severity.enum';

export interface AlertIdentifierThresholdResponse {
  severity: AlertSeverity;
  value: number;
  enabled?: boolean | null;
  label?: string | null;
  timeOverMinutes?: number;
}

