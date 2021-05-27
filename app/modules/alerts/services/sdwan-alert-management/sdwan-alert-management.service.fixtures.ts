import {SdwanAlertManagement} from './sdwan-alert-management';
import {AlertSeverity} from '../enums/alert-severity.enum';

export class SdwanAlertManagementServiceFixtures {
  static readonly SDWAN_ALERTS = [
    new SdwanAlertManagement({
      id: '1',
      enabled: true,
      description: 'description',
      type: 'VMANAGE',
      name: 'alert name',
      sharing: void 0,
      instanceName: '',
      severity: AlertSeverity.CRITICAL
    })
  ];
}
