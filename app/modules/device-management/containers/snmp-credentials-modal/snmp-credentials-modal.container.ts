import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import {  filter, map } from 'rxjs/operators';
import SnmpCredentials from '../../services/device-management-data/interfaces/snmp-credentials';
import DeviceSnmpCredentials from '../../services/device-management-data/interfaces/device-snmp-credentials';
import SnmpCredentialsRequest from '../../services/device-management-data/interfaces/snmp-credentials-request';
import ProfileSnmpCredentials from '../../services/device-management-data/interfaces/profile-snmp-credentials';
import DeviceCredentialsRequest from '../../services/device-management-data/interfaces/device-credentials-request';
import { CredentialStorageService } from '../../services/credential-storage/credential-storage.service';
import { DeviceManagementDataService } from '../../services/device-management-data/device-management-data.service';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';

@Component({
  selector: 'nx-snmp-credentials-modal-container',
  template: `
    <nx-snmp-credentials-modal
      [deviceCredentials]="deviceCredentials$ | async"
      [modalSubtitle]="subTitle"
      [isMultipleDevices]="devices?.length > 1"
      [profiles]="profiles$ | async"
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      (cancelClicked)="cancelClicked.emit()"
      (submitClicked)="handleSubmitClicked($event)"
    ></nx-snmp-credentials-modal>
  `,
  styles: [],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class SnmpCredentialsModalContainer implements OnChanges, OnDestroy {

  @Input() devices: {systemName: string, serial: string}[];
  @Output() cancelClicked = new EventEmitter<void>();
  @Output() submitClicked = new EventEmitter<void>();

  subTitle: string;

  isLoading$: Observable<boolean>;
  profiles$: Observable<ProfileSnmpCredentials[]>;
  deviceCredentials$: Observable<DeviceSnmpCredentials>;
  error$: Observable<SimpleAlert>;

  private static getSubTitle(devices): string {
    if (devices.length === 1) {
      return devices[0].systemName;
    }
    return `${devices.length} devices`;
  }

  constructor(
    private deviceManagementDataService: DeviceManagementDataService,
    private credentialStorageService: CredentialStorageService,
    private notificationService: NotificationService,
  ) {
    this.profiles$ = this.credentialStorageService.selectAll();
    this.deviceCredentials$ = this.deviceManagementDataService.selectCredential();
    this.error$ = this.deviceManagementDataService.selectError()
      .pipe(
        filter<DetailedError>(Boolean),
        map(error => new SimpleAlert(
          'Error',
          error?.message || null
        ))
      );
    this.isLoading$ = combineLatest([
      this.credentialStorageService.selectLoading(),
      this.deviceManagementDataService.selectLoading(),
    ]).pipe(
      map((loadings: Array<boolean>) => loadings.some((loading: boolean) => loading))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.devices.currentValue !== void 0 && !changes.devices.isFirstChange()) {
      this.subTitle = SnmpCredentialsModalContainer.getSubTitle(this.devices);
      this.initModal();
    }
  }

  ngOnDestroy(): void {
    this.deviceManagementDataService.resetStore();
    this.credentialStorageService.resetStore();
  }

  handleSubmitClicked(credential: SnmpCredentialsRequest) {
    const newDevices: DeviceCredentialsRequest[] = this.devices.map(({ serial }) => ({
        deviceSerial: serial,
        snmpCredential: credential
      })
    );
    this.deviceManagementDataService.bulkApplySnmpCredentials(
      newDevices,
      {
        type: credential.type,
        ...credential.credential as SnmpCredentials
      }
    )
      .subscribe((response) => {
        if (response.failedDevices.length) {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `SNMP credentials update failed for ${response.failedDevices.length} devices of ${this.devices.length}`,
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
        } else  if (response.failedDevices.length < this.devices.length) {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              'SNMP credentials successfully updated',
              NOTIFICATION_TYPE_ENUM.SUCCESS
            )
          );
        }
        this.submitClicked.emit();
      });
  }

  private initModal(): void {
    combineLatest([
      this.credentialStorageService.getSnmpCredentials(),
      this.deviceManagementDataService.getCredentials(this.devices)
    ]).subscribe();
  }
}
