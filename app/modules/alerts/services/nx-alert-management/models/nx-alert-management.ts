import AlertManagementAlert from '../../models/alert-management-alert';
import {ALERT_CATEGORIES} from '../enums/alert-categories.enum';
import {AlertSeverity} from '../../enums/alert-severity.enum';
import NxAlertManagementConfig from './nx-alert-management-config';
import NxAlertManagementConfigThreshold from './nx-alert-management-config-threshold';
import {Courier} from '../../couriers/models/courier';
import {CourierTypes} from '../../couriers/enums/courier-types.enum';
import {AlertIdentifierRequest} from '../../alert-identifiers/models/alert-identifier-request';
import {AlertIdentifierThresholdRequest} from '../../alert-identifiers/models/alert-identifier-threshold-request';
import {AlertSharing} from '../../couriers/models/alert-sharing';

/**
 * An alert on that represents an alert on the nx alerts tab
 */
export default class NxAlertManagement implements AlertManagementAlert {
  id: string;
  name: string;
  type: string;
  category: ALERT_CATEGORIES;
  severity: AlertSeverity;
  enabled: boolean;
  config: NxAlertManagementConfig;
  contributesToStatus: boolean;
  rank: number;
  description: string;
  sdwanAlarmType: string;
  coolDownMinutes: number;
  instanceName: string;
  customOidId: string;
  filterName: string;
  displayFilterTitle: string;
  displayFilterMessage: string;
  sharing: AlertSharing;
  displayCategory: string;
  useDefaultSharingConfig: boolean;
  sharingString: string;
  thresholdString: string;

  constructor({
                id,
                name,
                type,
                category,
                severity,
                enabled,
                config,
                contributesToStatus,
                rank,
                sharing,
                description,
                sdwanAlarmType,
                coolDownMinutes,
                instanceName,
                customOidId,
                filterName,
                useDefaultSharingConfig,
                displayFilterTitle,
                displayFilterMessage
              }: {
                id: string,
                name: string,
                type: string,
                category: ALERT_CATEGORIES,
                severity: AlertSeverity,
                enabled: boolean
                config: NxAlertManagementConfig,
                contributesToStatus: boolean,
                rank: number,
                sharing: AlertSharing,
                description?: string,
                sdwanAlarmType?: string, // todo needed?
                coolDownMinutes?: number,
                instanceName: string,
                customOidId?: string,
                filterName?: string,
                useDefaultSharingConfig: boolean,
                displayFilterTitle?: string, // todo - get info from old display https://liveaction.atlassian.net/browse/LD-26100
                displayFilterMessage?: string // todo - get info from old display https://liveaction.atlassian.net/browse/LD-26100
              }
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.category = category;
    this.severity = severity;
    this.enabled = enabled;
    this.config = config;
    this.contributesToStatus = contributesToStatus;
    this.rank = rank;
    this.description = description;
    this.sdwanAlarmType = sdwanAlarmType;
    this.coolDownMinutes = coolDownMinutes;
    this.instanceName = instanceName;
    this.customOidId = customOidId;
    this.filterName = filterName;
    this.displayFilterTitle = displayFilterTitle;
    this.displayFilterMessage = displayFilterMessage;
    this.sharing = sharing;
    this.displayCategory = ALERT_CATEGORIES[this.category];
    this.useDefaultSharingConfig = useDefaultSharingConfig;
    this.sharingString = this.buildSharingString(sharing);
    this.thresholdString = this.buildThresholdString(config);
  }

  transformToRequest(): AlertIdentifierRequest {
    let thresholds = this.config.thresholds
      .map((threshold: NxAlertManagementConfigThreshold): AlertIdentifierThresholdRequest => {
        return {
          label: threshold.label,
          severity: threshold.severity,
          value: threshold.value,
          enabled: threshold.enabled,
          timeOverMinutes: threshold.timeOverMinutes ?? this.config.timeOverMinutes
        } as AlertIdentifierThresholdRequest;
      });
    // if there are no thresholds update severity and timeOverMinutes
    // LD-27917 should move timeOverMinutes out of thresholds property (unless specific to threshold, like Node alerts)
    if (thresholds.length === 0 && this.config.timeOverMinutes != null) {
      thresholds = [{
        severity: this.severity,
        value: null,
        enabled: null,
        timeOverMinutes: this.config.timeOverMinutes
      }];
    }
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      enabled: this.enabled,
      rank: this.rank,
      config: {
        thresholds: thresholds
      },
      severity: this.severity,
      courierIds: this.getCourierIds(),
      coolDownMinutes: this.coolDownMinutes,
      instanceName: this.instanceName,
      useDefaultSharingConfig: this.useDefaultSharingConfig
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

  private buildThresholdString(config: NxAlertManagementConfig): string {
    if (config?.thresholds == null) {
      return '';
    }

    if (config.thresholds.length > 1) {
      return 'Multiple';
    } else {
      const threshold = config.thresholds[0];

      const timeOverMinutes = config.timeOverMinutes !== void 0 ? ` for at least > ${config.timeOverMinutes} minutes` : '';
      // QOS Class Drop with one threshold will not have name, comparator and units
      if (config.thresholds.length === 0 || threshold?.name == null) {
        return timeOverMinutes;
      }

      return `${threshold?.name} ${threshold?.comparator} ${threshold?.value} ${threshold?.units}${timeOverMinutes}`;
    }
  }

  /**
   * get courier ids to be saved with alert
   * scoped couriers have their own ids so if it exists it should be used
   * global couriers share an id so we need to check if it's enabled
   */
  private getCourierIds(): Array<string> {
    return [
      this.sharing?.email?.id,
      this.sharing?.serviceNow?.id,
      this.sharing?.snmpTrap?.enabled === true ? this.sharing?.snmpTrap?.id : void 0,
      this.sharing?.syslog?.enabled === true ? this.sharing?.syslog?.id : void 0
    ].filter((courierId: string) => courierId !== void 0);
  }
}
