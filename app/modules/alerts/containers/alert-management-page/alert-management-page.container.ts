import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {SdwanService} from '../../../integrations/services/sdwan/sdwan.service';
import IIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IIntegrationsValidate';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import {TabIds} from '../../components/alert-management-page/alert-management-tab-ids.enum';
import {NxAlertManagementService} from '../../services/nx-alert-management/nx-alert-management.service';
import {SdwanAlertManagementService} from '../../services/sdwan-alert-management/sdwan-alert-management.service';
import {CommonService} from '../../../../utils/common/common.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {AlertManagementSharingService} from '../../services/alert-management-sharing/alert-management-sharing.service';
import {ServiceNowService} from '../../../integrations/services/service-now/service-now.service';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-page-container',
  template: `
    <nx-alert-management-page
      [isLoading]="isLoading$ | async"
      [error]="detailedError"
      [isSdwanConfigured]="isSdwanConfigured$ | async"
      [selectedTab]="selectedTab"
      (alertClick)="alertClick.emit($event)"
      (maintenanceModeClick)="maintenanceModeClick.emit($event)"
      (tabSelected)="tabSelected.emit($event)"
    ></nx-alert-management-page>
  `,
  styles: [':host { display: block; height: 100%; }']
})
export class AlertManagementPageContainer implements OnInit, OnChanges, OnDestroy {
  @Input() selectedTab: TabIds; // angualrjs url param
  @Input() error: Error; // angularjs setup error
  @Output() alertClick = new EventEmitter<any>();
  @Output() maintenanceModeClick = new EventEmitter<void>();
  @Output() tabSelected = new EventEmitter<TabIds>();

  detailedError: DetailedError; // can remove after complete cutover from angularjs

  isLoading$: Observable<boolean>;
  isSdwanConfigured$: Observable<boolean>;

  constructor(private commonService: CommonService,
              private sdwanService: SdwanService,
              private nxAlertManagementService: NxAlertManagementService,
              private sdwanAlertManagementService: SdwanAlertManagementService,
              private alertManagementSharingService: AlertManagementSharingService,
              private serviceNowService: ServiceNowService) {

    this.isLoading$ = this.sdwanService.selectLoading();
  }

  ngOnInit(): void {
    this.isSdwanConfigured$ = this.sdwanService.getSdwan()
      .pipe(
        untilDestroyed(this),
        map((sdwanConfig: IIntegrationsValidate) => {
          return (sdwanConfig?.status !== ConfigurationEnum.UNKNOWN &&
            sdwanConfig?.status !== ConfigurationEnum.UNCONFIGURED);
        }),
        catchError((err) => {
          // swallow error, service will log it
          return of(false);
        })
      );

    // preload sharing configuration including service now fields and options (do not include in loading or show error here)
    forkJoin([
      this.alertManagementSharingService.getSharingConfiguration(),
      // remove once service now integration is migrated
      this.serviceNowService.getServiceNow()
    ])
      .pipe(
        switchMap(() => this.alertManagementSharingService.getServiceNow())
      ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes.error)) {
      const error = changes.error.currentValue;
      this.detailedError = error != null ? Object.assign({title: void 0}, changes.error.currentValue) : null;
    }
  }

  ngOnDestroy(): void {
    // clean up stores
    this.nxAlertManagementService.reset();
    this.sdwanAlertManagementService.reset();
    this.alertManagementSharingService.reset();
  }
}
