import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ReportHistoryService} from '../../services/report-history/report-history.service';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReportHistory} from '../../services/report-history/models/report-history.interface';
import {ReportHistoryValidation} from '../../services/report-history/models/report-history-validation.interface';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import {ReportStorage} from '../../services/report-storage/models/report-storage';
import {ReportHistoryComponent} from '../../components/report-history/report-history.component';
import {SubmitEmitterData} from '../../components/report-history/models/submit-emitter-data/submit-emitter-data';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportStorageService} from '../../services/report-storage/report-storage.service';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';

@UntilDestroy()
@Component({
  selector: 'nx-report-history-container',
  template: `
    <nx-report-history #reportHistoryComponent
                       [isLoading]="isLoading$ | async"
                       [error]="error$ | async"
                       [reportHistory]="reportHistory$ | async"
                       [reportHistoryValidation]="reportHistoryValidation$ | async"
                       [storage]="reportStorage$ | async"
                       (submit)="onSubmit($event)">
    </nx-report-history>
  `,
  styles: [':host {display: block; width: 100%;}'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class ReportHistoryContainer implements OnInit, OnDestroy {
  @ViewChild('reportHistoryComponent') reportHistoryComponent: ReportHistoryComponent;

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  reportHistoryValidation$: Observable<ReportHistoryValidation>;
  reportHistory$: Observable<ReportHistory>;
  reportStorage$: Observable<ReportStorage>;

  constructor(private reportHistoryService: ReportHistoryService,
              private reportStorageService: ReportStorageService,
              private notificationService: NotificationService) {
    this.reportHistoryValidation$ = this.reportHistoryService.getReportHistoryValidation();
    this.reportHistory$ = this.reportHistoryService.selectReportHistory();
    this.reportStorage$ = this.reportStorageService.selectReportStorage();

    this.isLoading$ = combineLatest([
      this.reportHistoryService.selectLoading(),
      this.reportStorageService.selectLoading()
    ]).pipe(
      map((loadings: Array<boolean>) => loadings.some((loading: boolean) => loading))
    );

    this.error$ = combineLatest([
      this.reportHistoryService.selectError(),
      this.reportStorageService.selectError()
    ]).pipe(
      map((errors: Array<DetailedError>) => {
        const existingErrors = errors.filter((error: DetailedError) => error != null);
        if (existingErrors.length > 0) {
          return existingErrors[0];
        }
        return void 0;
      })
    );
  }

  ngOnInit() {
    forkJoin({
      reportHistory: this.reportHistoryService.getReportHistory(),
      storage: this.reportStorageService.getServerStorage()
    }).pipe(
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnDestroy(): void {
  }

  onSubmit(formData: SubmitEmitterData): void {
    forkJoin({
      history: this.reportHistoryService.updateReportHistory(formData.history),
      storage: this.reportStorageService.updateReportStorageLimit(formData.reportCacheStorageLimit)
    }).subscribe(
      () => {
        const successMessage = new LaCustomNotificationDefinition(
          `Successfully updated`,
          NOTIFICATION_TYPE_ENUM.SUCCESS);
        this.updateNotification(successMessage);
        this.reportHistoryComponent.setFormPristine();
      },
      (error: Error) => {
        const errorMessage = new LaCustomNotificationDefinition(`Error: ${error.message}`, NOTIFICATION_TYPE_ENUM.ALERT);
        this.updateNotification(errorMessage);
      });
  }

  /**
   * Set state to notification with notification
   * @param notification notification object
   */
  updateNotification(notification: LaCustomNotificationDefinition): void {
    this.notificationService.sendNotification$(notification);
  }
}
