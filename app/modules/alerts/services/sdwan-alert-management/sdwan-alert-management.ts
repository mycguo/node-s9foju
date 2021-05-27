import {ALERT_CATEGORIES} from '../nx-alert-management/enums/alert-categories.enum';
import {AlertSeverity} from '../enums/alert-severity.enum';
import AlertManagementAlert from '../models/alert-management-alert';
import {Courier} from '../couriers/models/courier';
import {CourierTypes} from '../couriers/enums/courier-types.enum';
import {AlertIdentifierRequest} from '../alert-identifiers/models/alert-identifier-request';
import {AlertSharing} from '../couriers/models/alert-sharing';

/**
 * An alert on that represents an alert on the sdwan alerts tab
 */
export class SdwanAlertManagement implements AlertManagementAlert {
  id: string;
  name: string;
  category: ALERT_CATEGORIES;
  enabled: boolean;
  severity: AlertSeverity;
  type: string;
  description: string;
  sharing: AlertSharing;
  instanceName: string;
  sharingString: string;

  constructor({
                id,
                name,
                type,
                enabled,
                sharing,
                description,
                instanceName,
                severity
              }: {
    id: string,
    name: string,
    type: string,
    enabled: boolean
    sharing: AlertSharing,
    description: string,
    instanceName: string,
    severity: AlertSeverity
    // sdwanAlarmType?: string,
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.category = ALERT_CATEGORIES.VMANAGE;
    this.severity = severity; // note that it cannot be changed
    this.enabled = enabled;
    this.sharing = sharing;
    this.description = description;
    this.instanceName = instanceName;
    this.sharingString = this.buildSharingString(sharing);
  }

  transformToRequest(): AlertIdentifierRequest {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      enabled: this.enabled,
      rank: -1,
      config: {},
      severity: this.severity,
      courierIds: this.getCourierIds(),
      instanceName: this.instanceName,
      useDefaultSharingConfig: true // should be true by default
    };
  }


  private buildSharingString(sharing: AlertSharing): string {
    const couriers: Array<Courier> = [];
    for (const sharingKey in sharing) {
      if (sharing[sharingKey] != null) {
        couriers.push(sharing[sharingKey]);
      }
    }
    return couriers
      .filter((courier: Courier) => courier.enabled)
      .map((courier: Courier) => courier.displayName)
      .join(', ');
  }

  /**
   * get courier ids to be saved with alert
   */
  private getCourierIds(): Array<string> {
    return [
      this.sharing?.email?.id,
      this.sharing?.serviceNow?.id,
      this.sharing?.snmpTrap?.id,
      this.sharing?.syslog?.id
    ].filter((courierId: string) => courierId !== void 0);
  }
}
