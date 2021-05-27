import {Injectable} from '@angular/core';
import {Order, QueryConfig, QueryEntity} from '@datorama/akita';
import {combineLatest, Observable} from 'rxjs';
import {StausAlertsState} from './status-alerts-state.interface';
import {StatusAlertsStore} from './status-alerts.store';
import StatusAlertItem from '../../modules/topology/components/status-alerts-item/interfaces/status-alert-item';
import StatusAlertsSeverity from '../../modules/topology/components/status-alerts/enums/status-alerts-severity';

@Injectable({ providedIn: 'root' })
@QueryConfig({
  sortBy: 'dateOfLastAlertStateChange',
  sortByOrder: Order.DESC
})
export class StatusAlertsQuery extends QueryEntity<StausAlertsState, StatusAlertItem> {

  selectVisibilityFilter$ = this.select(state => state.ui.filter);

  constructor(protected store: StatusAlertsStore) {
    super(store);
  }

  selectVisibleAlerts$(): Observable<Array<StatusAlertItem>> {
    return combineLatest(
      this.selectVisibilityFilter$,
      this.selectAll(),
      this.getVisibleAlerts
    );
  }

  getVisibleAlerts(filter, alerts): StatusAlertItem[] {
    if (filter === StatusAlertsSeverity.ALL) {
      return alerts;
    }
    return alerts.filter(alert => alert.severity === filter);
  }

}
