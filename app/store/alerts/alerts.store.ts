import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import AlertsSummary from '../../services/alerts/alertsSummary.model';


export interface AlertsState {
  filteredAlerts: any;
  alertSummary: AlertsSummary;
}

function createInitialState(): AlertsState {
  return {
    filteredAlerts: null,
    alertSummary: null
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'alerts' })
export class AlertsStore extends Store<AlertsState> {
  constructor() {
    super(createInitialState());
  }

  setFilteredAlertsState(filteredAlerts: any) {
    this.update({ filteredAlerts });
  }

  setAlertSummary(alertSummary: AlertsSummary) {
    this.update({ alertSummary });
  }
}
