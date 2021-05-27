import {ALERT_CATEGORIES} from '../enums/alert-categories.enum';
import AlertManagementAlert from '../../models/alert-management-alert';
import {AlertSeverity} from '../../enums/alert-severity.enum';
import NxAlertManagement from './nx-alert-management';
import {Courier} from '../../couriers/models/courier';
import {AlertIdentifierRequest} from '../../alert-identifiers/models/alert-identifier-request';
import {AlertSharing} from '../../couriers/models/alert-sharing';

export class NxAlertManagementHierarchical extends NxAlertManagement {
  public static readonly THRESHOLD = 'Multiple';

  alerts: Array<NxAlertManagement>;
  displayCategory: string;

  constructor({
                id,
                name,
                type,
                category,
                contributesToStatus,
                alerts,
                sharing,
                instanceName
              }: {
                id: string,
                name: string,
                type: string,
                category: ALERT_CATEGORIES,
                contributesToStatus: boolean,
                alerts: Array<NxAlertManagement>,
                sharing: AlertSharing,
                instanceName: string
              }
  ) {
    super({
      id: id,
      name: name,
      type: type,
      category: category,
      severity: AlertSeverity.MULTIPLE,
      contributesToStatus: contributesToStatus,
      config: void 0,
      rank: -1,
      enabled: alerts.some((alert: NxAlertManagement) => alert.enabled),
      sharing: sharing,
      instanceName: instanceName,
      useDefaultSharingConfig: false
    });
    this.alerts = alerts;
    this.displayCategory = ALERT_CATEGORIES[this.category];
    this.thresholdString = NxAlertManagementHierarchical.THRESHOLD;
  }

  transformAlertsToRequest(): Array<AlertIdentifierRequest> {
    return this.alerts.map((alert: NxAlertManagement) => alert.transformToRequest());
  }
}
