import {Component, OnInit} from '@angular/core';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {ReportInfoValue} from '../../../reporting/models/report-info';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportInfoService} from '../../../reporting/services/report-info/report-info.service';
import {DeviceEntityPageReportsService} from '../../services/device-entity-page-reports/device-entity-page-reports.service';
import {map, take} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {DeviceEntityPageReport} from '../../services/device-entity-page-reports/models/device-entity-page-report';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';

@UntilDestroy()
@Component({
  selector: 'nx-device-entity-page-reports-container',
  template: `
    <nx-device-entity-page-reports
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [reports]="reports$ | async"
      [configuredReports]="configuredReports$ | async"
      (saveClicked)="handleSave($event)">
    </nx-device-entity-page-reports>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class DeviceEntityPageReportsContainer implements OnInit {
  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  reports$: Observable<Array<ReportInfoValue>>;
  configuredReports$: Observable<Array<DeviceEntityPageReport>>;
  notification: LaCustomNotificationDefinition;

  constructor(private notificationService: NotificationService,
              private reportInfoService: ReportInfoService,
              private deviceEntityPageReportsService: DeviceEntityPageReportsService) {
    this.isLoading$ = combineLatest([
      this.reportInfoService.selectLoading(),
      this.deviceEntityPageReportsService.selectLoading()
    ]).pipe(
      untilDestroyed(this),
      map((loadings: Array<boolean>) => loadings.some((loading: boolean) => loading))
    );

    this.error$ = combineLatest([
      this.reportInfoService.selectError(),
      this.deviceEntityPageReportsService.selectError()
    ]).pipe(
      untilDestroyed(this),
      map((errors: Array<Error>): DetailedError => {
        const filteredErrors = errors.filter((e: Error) => e != null);
        return filteredErrors.length > 0 ? filteredErrors[0] as DetailedError : null;
      })
    );

    this.reports$ = this.reportInfoService.selectReports();
    this.configuredReports$ = this.deviceEntityPageReportsService.selectDeviceEntityReports(false);
  }

  ngOnInit(): void {
    forkJoin([
      this.reportInfoService.getReportInfo(),
      this.deviceEntityPageReportsService.getReportInfo()
    ])
      .pipe(take(1))
      .subscribe();
  }

  handleSave(reports: Array<DeviceEntityPageReport>): void {
    this.deviceEntityPageReportsService.save(reports)
      .pipe(
        take(1)
      )
      .subscribe(() => {
          const notification = new LaCustomNotificationDefinition(
            'Successfully Saved',
            NOTIFICATION_TYPE_ENUM.SUCCESS
          );
          this.notificationService.sendNotification$(notification);
        },
        (error: DetailedError) => {
          const notification = new LaCustomNotificationDefinition(
            error.message,
            NOTIFICATION_TYPE_ENUM.ALERT
          );
          this.notificationService.sendNotification$(notification);
        });
  }
}
