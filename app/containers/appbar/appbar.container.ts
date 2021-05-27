import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import User from '../../services/user/user.model';
import {catchError, filter, take, tap} from 'rxjs/operators';
import {noop, of, Subscription} from 'rxjs';
import {LicenseService} from '../../services/license/license.service';
import {NotificationSidebarService} from '../../services/notification-sidebar/notification-sidebar.service';
import {NxNotificationsService} from '../../services/nx-notifications/nx-notifications.service';
import {Logger} from '../../modules/logger/logger';

@Component({
  selector: 'nx-appbar-container',
  template: `
    <nx-appbar
      [user]="loggedInUser"
      [unreadNotificationsIndicatorCount]="notificationCount"
      (notificationMenuClicked)="toggleNotificationWindow()"
    ></nx-appbar>
  `,
  styles: []
})
export class AppbarContainer implements OnInit, OnDestroy {

  loggedInUser: User;
  notificationCount = 0;

  userServiceSub: Subscription;
  uxLicenseServiceSub: Subscription;
  nxLicenseServiceSub: Subscription;
  versionSub: Subscription;
  cleanInstallationStatusSub: Subscription;
  nxNotificationsServiceSub: Subscription;

  constructor(
    private userService: UserService,
    private licenseService: LicenseService,
    private logger: Logger,
    private notificationSidebarService: NotificationSidebarService,
    private nxNotificationsService: NxNotificationsService,
  ) { }

  ngOnInit() {
    this.userServiceSub = this.userService.getLoggedInUser()
      .pipe(
        filter(user => !!user),
        take(1),
        catchError((err) => {
          this.logger.error(err);
          return of(null);
        })
      )
      .subscribe((user) => {
        this.loggedInUser = user;
    });

    this.uxLicenseServiceSub = this.licenseService.getUxLicenseInfo()
      .pipe(
        tap( license => {
          console.log(license);
        })
      ).subscribe();

    this.nxLicenseServiceSub = this.licenseService.getNxLicenseInfo()
      .pipe(
        tap(license => {
          console.log(license);
        })
      )
      .subscribe();

    this.versionSub = this.licenseService.getVersionInfo()
      .subscribe();

    this.cleanInstallationStatusSub = this.licenseService.getCleanInstallationStatus()
      .subscribe();

    this.nxNotificationsServiceSub = this.nxNotificationsService.getNotifications()
      .pipe(
        tap( notofications => {
          this.notificationCount = notofications.length;
        })
      )
      .subscribe();
  }

  toggleNotificationWindow() {
    this.notificationSidebarService.toggleNotificationSidebarOpenState();
  }

  ngOnDestroy(): void {
    this.userServiceSub ? this.userServiceSub.unsubscribe() : noop();
    this.uxLicenseServiceSub ? this.uxLicenseServiceSub.unsubscribe() : noop();
    this.nxLicenseServiceSub ? this.nxLicenseServiceSub.unsubscribe() : noop();
    this.versionSub ? this.versionSub.unsubscribe() : noop();
    this.cleanInstallationStatusSub ? this.cleanInstallationStatusSub.unsubscribe() : noop();
    this.nxNotificationsServiceSub ? this.nxNotificationsServiceSub.unsubscribe() : noop();
  }

}
