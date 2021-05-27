import {ALERT_CATEGORIES} from '../../nx-alert-management/enums/alert-categories.enum';
import {AlertSeverity} from '../../enums/alert-severity.enum';
import {AlertIdentifierThresholdResponse} from './alert-identifier-threshold-response';

export interface AlertIdentifierResponse {
  id: string;
  name: string;
  type: string; // Hierarchical alerts will need to be grouped by type and organized with rank
  category: ALERT_CATEGORIES;
  enabled: boolean;
  rank: number;
  config: {
    thresholds?: Array<AlertIdentifierThresholdResponse>;
    timeOverMinutes?: number;
    filter?: {
      flexString: string;
    };
  };
  severity: AlertSeverity; // can be ‘multiple’ multiple thresholds ie hierarchical alerts
  courierIds?: Array<string>;
  description?: string;
  sdwanAlarmType?: string;
  coolDownMinutes?: number;
  instanceName: string;
  customOidId?: string;
  filterName?: string;
  useDefaultSharingConfig: boolean;

  // todo currently identified in alertTypes.constant
  // contributesToStatus: boolean;
  // todo currently hardcoded in laAlertingManagementSidebar.html and identified in alertTypes.constant as advanced
  // displayFilterTitle?: string;
  // displayFilterMessage?: string;
}
