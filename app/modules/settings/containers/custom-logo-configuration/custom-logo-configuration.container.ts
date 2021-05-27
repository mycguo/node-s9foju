import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {LogosService} from '../../services/logos/logos.service';
import {take} from 'rxjs/operators';
import Logo from '../../services/logos/models/logo';
import LogosConfiguration from '../../services/logos/models/logos-configuration';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaEscapeSpecialCharsFilter from '../../../../../../../client/app/filters/laEscapeSpecialChars.filter';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {ConfirmDialogInterface} from '../../../shared/components/confirm-dialog/confirm-dialog.interface';
import {Size} from '../../../shared/enums/size';
import {DialogService} from '../../../shared/services/dialog/dialog.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';

@UntilDestroy()
@Component({
  selector: 'nx-custom-logo-configuration-container',
  template: `
    <nx-custom-logo-configuration
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [logos]="logos$ | async"
      [activeLogoId]="activeId$ | async"
      [logosConfig]="logoConfig$ | async"
      (delete)="onDelete($event)"
      (defaultLogo)="setDefaultLogo($event)"
      (notification)="updateNotification($event)">
    </nx-custom-logo-configuration>
  `,
  styles: [':host { display: block; }'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }],
})
export class CustomLogoConfigurationContainer implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  logos$: Observable<Array<Logo>>;
  activeId$: Observable<string>;
  logoConfig$: Observable<LogosConfiguration>;
  /**
   * @ignore
   */
  constructor(private logosService: LogosService,
              private notificationService: NotificationService,
              private dialog: DialogService) {
  }

  /**
   * Setup subscriptions
   */
  ngOnInit() {
    this.isLoading$ = this.logosService.selectLoading$();
    this.error$ = this.logosService.selectError$();
    this.logoConfig$ = this.logosService.getLogoConfiguration$();
    this.activeId$ = this.logosService.selectActiveLogoId$();
    this.logos$ = this.logosService.selectLogos$();
    // observable
    this.logosService.getLogos$()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe();
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
  }

  /**
   * Delete Logo
   * @param logo logo object
   */
  onDelete(logo: Logo): void {
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: `Delete Logo`,
          message: `Are you sure you want to delete selected logo?`
        } as ConfirmDialogInterface,
        size: Size.SM
      },
      (hasConfirmed) => {
        if (hasConfirmed) {
          this.logosService.deleteLogo$(logo.id).pipe(
            take(1)
          ).subscribe(
            () => {
              this.updateNotification(
                new LaCustomNotificationDefinition
                (`Success: ${LaEscapeSpecialCharsFilter()(logo.name)} deleted`, NOTIFICATION_TYPE_ENUM.SUCCESS)
              );
            },
            (err) => {
              this.updateNotification(new LaCustomNotificationDefinition(err.message, NOTIFICATION_TYPE_ENUM.ALERT));
            });
        }
      }
    );
  }

  /**
   * Set default logo
   * @param logoId Id of logo (void 0/null if none)
   */
  setDefaultLogo(logoId?: string): void {
    this.logosService.updateDefault$(logoId).pipe(
      take(1)
    ).subscribe(
      () => {},
      (err) => {
        this.updateNotification(new LaCustomNotificationDefinition(err.message, NOTIFICATION_TYPE_ENUM.ALERT));
      }
    );
  }

  /**
   * Set state to notification with notification
   * @param notification notification object
   */
  updateNotification(notification: LaCustomNotificationDefinition): void {
    this.notificationService.sendNotification$(notification);
  }
}
