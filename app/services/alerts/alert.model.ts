import AlertDescription from './alertDescription.model';
import AlertStatus from './alertStatus.enum';
import AlertIdentity from './alertIdentity';


export default class Alert implements AlertIdentity {
  version: number;
  alertId: string;
  type: string;
  alertCategory: string;
  alertIdentifierId: string;
  dateCreated: Date;
  durationSinceCreatedMinutes: number;
  durationActiveMinutes: number;
  severity: string;
  userStatus: string;
  alertState: string;
  dateOfLastAlertStateChange: Date;
  description: AlertDescription;
  alertIntegrations: {
    serviceNowAlertIntegrations: any
  };
}
