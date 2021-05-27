import { Component, OnInit } from '@angular/core';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { CommonService } from '../../../../utils/common/common.service';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LivencaService } from '../../services/livenca/livenca.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-livenca-integrations-container',
  styles: [':host { display: block; text-align: center; } :host > * { text-align: left; } '],
  template: `
    <nx-livenca-integrations
      [isLoading]="selectLoading$ | async"
      [data]="selectLivenca$ | async"
      [error]="selectError$ | async"
      [displayState]="displayState"
      (edit)="onEdit()"
      (delete)="onDelete()"
      (formSubmit)="updateConfig($event)"
      (cancel)="onCancel()">
    </nx-livenca-integrations>
  `,
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class LivencaIntegrationsContainer implements OnInit {

  displayState: IntegrationDisplayStateEnum;
  selectLivenca$: Observable<{ hostname: string, isStale: boolean }>;
  selectLoading$: Observable<boolean>;
  selectError$: Observable<DetailedError>;

  constructor(
    private commonService: CommonService,
    private notificationService: NotificationService,
    private livencaService: LivencaService
  ) {
    this.selectLivenca$ = this.livencaService.selectLivenca();
    this.selectLoading$ = this.livencaService.selectLoading();
    this.selectError$ = this.livencaService.selectError();
  }

  ngOnInit(): void {

    this.livencaService.getLivenca()
      .pipe(
        take(1),
        untilDestroyed(this)
      )
      .subscribe(({hostname}) => {
        if (hostname == null) {
          this.displayState = IntegrationDisplayStateEnum.ADD;
        } else {
          this.displayState = IntegrationDisplayStateEnum.VIEW;
        }
      });
  }

  onEdit(): void {
    this.displayState = IntegrationDisplayStateEnum.EDIT;
  }

  onDelete(): void {
    this.livencaService.deleteLivenca()
      .pipe(
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.notify(NOTIFICATION_TYPE_ENUM.SUCCESS, 'LiveNCA configuration successfully deleted');
        this.displayState = IntegrationDisplayStateEnum.ADD;
      }, (error: HttpErrorResponse) => {
        this.notify(NOTIFICATION_TYPE_ENUM.ALERT, error.message);
      });
  }

  updateConfig(event: { hostname: string }): void {
    this.livencaService.updateLivenca(event.hostname)
      .pipe(
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.notify(NOTIFICATION_TYPE_ENUM.SUCCESS, 'LiveNCA configuration successfully updated');
        this.displayState = IntegrationDisplayStateEnum.VIEW;
      }, (error: HttpErrorResponse) => {
        this.notify(NOTIFICATION_TYPE_ENUM.ALERT, error.message);
      });

  }

  onCancel(): void {
    this.displayState = IntegrationDisplayStateEnum.VIEW;
  }

  notify(type: NOTIFICATION_TYPE_ENUM, message: string): void {
    this.notificationService.sendNotification$(new LaCustomNotificationDefinition(message, type));
  }
}
