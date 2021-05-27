import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {take} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {ApiError} from '../../../../utils/api-error';
import {BaseContainer} from '../../../../containers/base-container/base.container';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {StatusAlertsQuery} from '../../../../store/status-alerts/status-alerts.query';
import {StatusAlertsService} from '../../services/status-alerts/status-alerts.service';
import StatusAlertItem from '../../components/status-alerts-item/interfaces/status-alert-item';
import StatusAlertsState from './interfaces/status-alerts-state';
import StatusAlertsContainerState from './interfaces/status-alerts-container-state';
import StatusAlertsSeverity from '../../components/status-alerts/enums/status-alerts-severity';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';

// number of alerts displayed
export const ALERTS_LIMIT = 50;

@UntilDestroy()
@Component({
  selector: 'nx-status-alerts-container',
  template: `
    <nx-status-alerts [alerts]="state.alerts"
                      [isLoading]="state.isLoading"
                      [error]="state.error"
                      [alertsLimit]="state.alertsLimit"
                      (changeFilter)="changeFilter($event)"
                      (closeDrawer)="onCloseDrawer()"></nx-status-alerts>`
})

export class StatusAlertsContainer extends BaseContainer<StatusAlertsState> implements OnInit, OnDestroy {

  state: StatusAlertsState = {
    alerts: [],
    isLoading: true,
    error: undefined,
    alertsLimit: {
      limit: ALERTS_LIMIT,
      isReached: false
    },
    fatalMessageOverride: void 0
  };

  @Output() closeDrawer = new EventEmitter<void>();
  @Input() setElementState = (state) => this.stateInput(state);

  constructor(
    public cd: ChangeDetectorRef,
    private statusAlertsService: StatusAlertsService,
    private statusAlertsQuery: StatusAlertsQuery
  ) {
    super(cd);
  }

  ngOnInit(): void {
    this.statusAlertsService.updateFilter(StatusAlertsSeverity.ALL);
    combineLatest([
      this.statusAlertsQuery.selectVisibleAlerts$(),
      this.statusAlertsQuery.selectLoading(),
      this.statusAlertsQuery.selectError()
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(([alerts, loading, error]: [StatusAlertItem[], boolean, ApiError]) => {
      this.setState(this.getAlertsState(alerts.slice(0, ALERTS_LIMIT), loading, error, alerts.length > ALERTS_LIMIT));
    });
  }

  ngOnDestroy() {
    this.cd.detach();
  }

  stateInput(state: StatusAlertsContainerState) {
    if (state.historical) {
      this.statusAlertsService.setHistoricalAlert();
      return;
    }
    this.statusAlertsService.getStatusAlerts$(state.filters).pipe(
      take(1),
    ).subscribe();
  }

  onCloseDrawer() {
    this.closeDrawer.emit();
  }

  changeFilter(filterId) {
    this.statusAlertsService.updateFilter(filterId);
  }

  private getAlertsState(alerts: StatusAlertItem[], loading: boolean, error: ApiError, isReached: boolean): StatusAlertsState {
    let errorState: LaNoDataMessage;

    if (error) {
      loading = false;
      if (error.clientMessage) {
        errorState = new LaNoDataMessage(void 0, error.clientMessage, 'la-no-data-message__icon-no-alerts');
      } else {
        errorState = new LaNoDataMessage(error.name, error.statusText, 'la-no-data-message__icon-warning');
      }
      return {
        alerts: alerts,
        isLoading: loading,
        error: new DetailedError(errorState.title, errorState.instruction),
        fatalMessageOverride: errorState,
        alertsLimit: {limit: ALERTS_LIMIT, isReached: isReached}
      };
    }

    if (alerts.length === 0 && !loading) {
      errorState = new LaNoDataMessage('No alerts for current filter', void 0, 'la-no-data-message__icon-no-alerts');
      return {
        alerts: alerts,
        isLoading: loading,
        error: new DetailedError(errorState.title, errorState.instruction),
        fatalMessageOverride: errorState,
        alertsLimit: {limit: ALERTS_LIMIT, isReached: isReached}
      };
    }

    return {
      alerts: alerts,
      isLoading: loading,
      error: void 0,
      fatalMessageOverride: void 0,
      alertsLimit: {limit: ALERTS_LIMIT, isReached: isReached}
    };
  }

}
