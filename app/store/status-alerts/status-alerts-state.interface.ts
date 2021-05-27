import {ActiveState, EntityState} from '@datorama/akita';
import StatusAlertItem from '../../modules/topology/components/status-alerts-item/interfaces/status-alert-item';
import StatusAlertsSeverity from '../../modules/topology/components/status-alerts/enums/status-alerts-severity';

export interface StausAlertsState extends EntityState<StatusAlertItem>, ActiveState {
  ui: {
    filter: StatusAlertsSeverity;
  };
}
