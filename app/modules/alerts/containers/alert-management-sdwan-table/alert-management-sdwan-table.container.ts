import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import FilterChange from '../../../grid/components/filters/filter-change';
import {SdwanAlertManagement} from '../../services/sdwan-alert-management/sdwan-alert-management';
import {SdwanAlertManagementService} from '../../services/sdwan-alert-management/sdwan-alert-management.service';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import {TableFilter} from '../../../grid/components/filters/table-filter';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {map} from 'rxjs/operators';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-sdwan-table-container',
  template: `
    <nx-alert-management-sdwan-table
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [data]="filteredTableData$ | async"
      [statusBarData]="statusBarData$ | async"
      [tableFilters]="tableFilters"
      [isDisabledBtnDisabled]="isDisabledBtnDisabled"
      [isEnableBtnDisabled]="isEnableBtnDisabled"
      (rowIdsSelected)="handleRowSelected($event)"
      (columnSortChanged)="handleColumnSortChanged($event)"
      (columnFilterChanged)="handleColumnFilterChanged($event)"
      (globalSearchTermChanged)="handleGlobalSearchTermChanged($event)"
      (enabledClicked)="handleEnableClick()"
      (disabledClicked)="handleDisableClick()"
      (alertClicked)="alertClick.emit($event)"></nx-alert-management-sdwan-table>`,
  styles: [':host {display: block;}'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class AlertManagementSdwanTableContainer implements OnInit, OnDestroy {
  @Output() alertClick = new EventEmitter<string>();

  isLoading$: Observable<boolean> = this.sdwanAlertManagementService.selectLoading();
  error$: Observable<DetailedError> = this.sdwanAlertManagementService.selectError()
    .pipe(map<Error, DetailedError>((err: Error) => {
      return (err == null) ? void 0 : Object.assign(err, {title: void 0});
    }));
  filteredTableData$: Observable<Array<SdwanAlertManagement>> = this.sdwanAlertManagementService.selectFilteredAlerts();
  isEnableBtnDisabled = true;
  isDisabledBtnDisabled = true;
  selectedAlertIds: Array<string> = [];
  tableFilters: Array<TableFilter>;
  statusBarData$: Observable<GridStatusBar>;

  constructor(private notificationService: NotificationService,
              private sdwanAlertManagementService: SdwanAlertManagementService) {
    this.sdwanAlertManagementService.setSortBy('name', 'asc');
    this.statusBarData$ = this.sdwanAlertManagementService.selectStatusBarData();
  }

  ngOnInit() {
    this.tableFilters = this.sdwanAlertManagementService.getFilters();

    this.sdwanAlertManagementService.getSdwanAlerts()
      .pipe(untilDestroyed(this))
      .subscribe();

    this.sdwanAlertManagementService.selectActiveAlerts()
      .pipe(untilDestroyed(this))
      .subscribe((alerts: Array<SdwanAlertManagement>) => {
        // reset
        this.isEnableBtnDisabled = true;
        this.isDisabledBtnDisabled = true;
        this.selectedAlertIds = alerts.map((alert: SdwanAlertManagement) => {
          if (alert.enabled) {
            this.isDisabledBtnDisabled = false;
          } else {
            this.isEnableBtnDisabled = false;
          }
          return alert.id;
        });
      });
  }

  ngOnDestroy(): void {
  }

  handleRowSelected(alertIds: Array<string>) {
    this.sdwanAlertManagementService.setActiveAlerts(alertIds);
  }

  handleEnableClick(): void {
    this.updateSelectedAlerts(true);
  }

  handleDisableClick(): void {
    this.updateSelectedAlerts(false);
  }

  updateSelectedAlerts(enabled: boolean): void {
    this.sdwanAlertManagementService.enabledDisableSelectedAlerts(enabled)
      .subscribe(
        (message: string) => {
          this.notificationService.sendNotification$(new LaCustomNotificationDefinition(
            message,
            NOTIFICATION_TYPE_ENUM.SUCCESS
          ));
        },
        ((error: Error) => {
          this.notificationService.sendNotification$(new LaCustomNotificationDefinition(
            error.message,
            NOTIFICATION_TYPE_ENUM.ALERT
          ));
        }));
  }

  handleColumnSortChanged(change: GridColumnSort): void {
    if (change === void 0) {
      this.sdwanAlertManagementService.clearSort();
    } else {
      this.sdwanAlertManagementService.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  handleColumnFilterChanged(filterChanges: Array<FilterChange>): void {
    filterChanges.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.sdwanAlertManagementService.setFilter(filter.field, filter.term);
      }
    });
  }

  handleGlobalSearchTermChanged(searchTerm: string): void {
    this.sdwanAlertManagementService.setGlobalFilter(searchTerm);
  }
}
