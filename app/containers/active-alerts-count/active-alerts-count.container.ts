import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertsService} from '../../services/alerts/alerts.service';
import AlertsSummary from '../../services/alerts/alertsSummary.model';
import {noop, Subscription} from 'rxjs';
import {SocketService} from '../../services/socket/socket.service';

@Component({
  selector: 'nx-active-alerts-count-container',
  template: `
    <nx-active-alerts-count
      [alertsSummary]="alertsSummary"
    ></nx-active-alerts-count>
  `,
  styles: []
})
export class ActiveAlertsCountContainer implements OnInit, OnDestroy {

  alertsSummary: AlertsSummary;
  alertsSummarySub: Subscription;

  constructor(
    private alertsService: AlertsService,
  ) { }

  ngOnInit() {
    this.alertsService.fetchAlertsSummary();
    this.alertsSummarySub = this.alertsService.alertSummary$
      .subscribe(
        (alertsSummary) => {
          this.alertsSummary = alertsSummary;
        }
      );

  }

  ngOnDestroy(): void {
    this.alertsSummarySub ? this.alertsSummarySub.unsubscribe() : noop();
  }

}
