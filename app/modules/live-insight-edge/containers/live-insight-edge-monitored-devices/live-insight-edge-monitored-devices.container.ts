import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsPlatformService } from '../../../../services/analytics-platform/analytics-platform.service';
import { Observable, Subscription } from 'rxjs';
import GridData from '../../../grid/models/grid-data.model';
import AnalyticsPlatformMonitoredDevice from '../../../../services/analytics-platform/monitored-devices/analytics-platform-monitored-device.model';
import FilterChange from '../../../grid/components/filters/filter-change';
import { LiveInsightEdgePageService } from '../../services/live-insight-edge-page/live-insight-edge-page.service';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import { switchMap, take, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogInterface } from '../../../shared/components/confirm-dialog/confirm-dialog.interface';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { Size } from '../../../shared/enums/size';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { LiveInsightEdgeSnmpImportModalComponent } from '../../components/live-insight-edge-snmp-import-modal/live-insight-edge-snmp-import-modal.component';


@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-monitored-devices-container',
  template: `
    <nx-live-insight-edge-monitored-devices
            [deviceList]="filteredGridData$ | async"
            [selectedDeviceIds]="selectedDeviceIds$ | async"
            [statusBarData]="statusBarData$ | async"
            [deleteButtonActive]="(liveInsightEdgePageService.pageState$() | async)?.isDeleteDevicesButtonActive"
            [importSnmpButtonActive]="(liveInsightEdgePageService.pageState$() | async)?.isImportSnmpButtonActive && !(importSnmpLoading$ | async)"
            [importSnmpTaskLoading]="importSnmpLoading$ | async"
            [errorMessage]="(dataSource.monitoredDevicesLoadErrors$() | async)?.errorMessage"
            [isMonitoredDevicesLoading]="dataSource.monitoredDevicesLoading$() | async"
            (searchTermChanged)="handleSearchTermChanged($event)"
            (columnFilterChanged)="handleColumnFilterChanged($event)"
            (columnSortChanged)="handleColumnSortChanged($event)"
            (devicesSelected)="handleDevicesSelected($event)"
            (addDevicesClicked)="handleAddDevicesClicked()"
            (deleteDevicesClicked)="handleDeleteDevicesClicked()"
            (importSnmpClicked)="handleImportSnmpClicked()"
    ></nx-live-insight-edge-monitored-devices>
  `,
  styles: [':host { display: flex; flex-grow: 1; }']
})
export class LiveInsightEdgeMonitoredDevicesContainer implements OnInit, OnDestroy {

  filteredGridData$: Observable<GridData<AnalyticsPlatformMonitoredDevice>>;
  statusBarData$: Observable<GridStatusBar>;
  selectedDeviceIds$: Observable<string[]>;
  importSnmpLoading$: Observable<boolean>;
  importSnmpDataStatusCheckerSubscription: Subscription;

  constructor(
    public dataSource: AnalyticsPlatformService,
    public liveInsightEdgePageService: LiveInsightEdgePageService,
    private dialog: DialogService,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {

    this.filteredGridData$ = this.dataSource.getFilteredDevicesAsGrid$();
    this.selectedDeviceIds$ = this.dataSource.selectFilteredActiveRows();
    this.statusBarData$ = this.dataSource.selectStatusBarData().pipe(
      untilDestroyed(this),
      tap(data => {
        this.liveInsightEdgePageService.setPageState({isDeleteDevicesButtonActive: data.selectedRows > 0});
      })
    );
    this.importSnmpLoading$ = this.dataSource.selectImportSnmpDataLoading();
    this.importSnmpDataStatus(true);

    this.dataSource.fetchMonitoredDevices();
  }

  handleSearchTermChanged(changed: string) {
    this.dataSource.setGlobalFilter(changed);
  }

  handleColumnFilterChanged(columnFilters: Array<FilterChange>) {
    columnFilters.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.dataSource.setFilter(filter.field, filter.term);
      }
    });
  }

  handleColumnSortChanged(columnSort: GridColumnSort) {
    if (columnSort === void 0) {
      this.dataSource.clearSort();
    } else {
      this.dataSource.setSortBy(columnSort.colId, columnSort.sort, columnSort.customSortFn);
    }
  }

  handleDevicesSelected(selectedDevices: Array<string>) {
    this.dataSource.setSelectedEntities(selectedDevices);
  }

  handleAddDevicesClicked() {
    this.liveInsightEdgePageService.setPageState( { isDeviceAddModalOpen: true } );
  }

  handleDeleteDevicesClicked() {
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: `Delete Devices`,
          message: `Are you sure you want to delete selected devices?`,
        } as ConfirmDialogInterface,
        size: Size.SM
      },
      (hasConfirmed) => { if (hasConfirmed) { this.deleteConfig(); } }
    );
  }

  handleImportSnmpClicked() {
    this.dialog.open(
      LiveInsightEdgeSnmpImportModalComponent,
      {
        size: Size.SM
      },
      (result: { timeRange: number }) => { if (result?.timeRange) { this.importSnmpData(result.timeRange); } }
    );
  }

  private deleteConfig() {
    this.liveInsightEdgePageService.setPageState({
      isDeleteDevicesButtonActive: false,
      deleteMonitoredDevicesSubmitErrors: null
    });
    this.dataSource.getSelectedDevicesIds()
      .pipe(
        take(1),
        switchMap(selectedDevices => this.dataSource.removeMonitoredDevices(selectedDevices))
      )
      .subscribe(
        () => {
          // disable delete btn after success delete operation
          this.liveInsightEdgePageService.setPageState({isDeleteDevicesButtonActive: false});
        },
        errors => {
          this.notificationService.sendNotification$(new LaCustomNotificationDefinition(
            errors.errorMessage,
            NOTIFICATION_TYPE_ENUM.ALERT
          ));
          this.liveInsightEdgePageService.setPageState({
            isDeleteDevicesButtonActive: true
          });
        });
  }

  private importSnmpData(timeRange: number) {
    this.dataSource.startSnmpImport(timeRange)
      .pipe(
        take(1)
      )
      .subscribe(() => {
        }, (() => {
        this.importSnmpDataStatusCheckerSubscription.unsubscribe();
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `Error starting SNMP import`,
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
        })
      );
    this.importSnmpDataStatus();
  }

  private importSnmpDataStatus(initialCheck: boolean = false): void {
    if (this.importSnmpDataStatusCheckerSubscription !== void 0) {
      this.importSnmpDataStatusCheckerSubscription.unsubscribe();
    }
    this.importSnmpDataStatusCheckerSubscription = this.dataSource.importSnmpDataStatusChecker()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(success => {
        // if called from init and there are no running tasks don't display success notification
        if (success && !initialCheck) {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              'SNMP data successfully imported',
              NOTIFICATION_TYPE_ENUM.SUCCESS
            )
          );
        }
        // if there were running tasks set initial to false to display notification when tasks are finished
        initialCheck = false;

      }, () => {
        if (!initialCheck) {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `Error getting import status`,
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
        }
      });
  }

  ngOnDestroy(): void {
    if (this.importSnmpDataStatusCheckerSubscription !== void 0) {
      this.importSnmpDataStatusCheckerSubscription.unsubscribe();
    }
  }

}
