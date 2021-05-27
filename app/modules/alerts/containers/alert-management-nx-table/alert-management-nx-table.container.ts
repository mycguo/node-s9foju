import {Component, EventEmitter, OnInit, Output, OnDestroy} from '@angular/core';
import AlertManagementAlert from '../../services/models/alert-management-alert';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import FilterChange from '../../../grid/components/filters/filter-change';
import {NxAlertManagementService} from '../../services/nx-alert-management/nx-alert-management.service';
import {Observable} from 'rxjs';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import {TableFilter} from '../../../grid/components/filters/table-filter';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import NxAlertManagement from '../../services/nx-alert-management/models/nx-alert-management';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {map} from 'rxjs/operators';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-nx-table-container',
  template: `
    <nx-alert-management-table
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [data]="(filteredTableData$ | async)"
      [selectedAlertIds]="selectedAlertIds"
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
      (alertClicked)="handleAlertClick($event)"></nx-alert-management-table>`,
  styles: [':host {display: block;}'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class AlertManagementNxTableContainer implements OnInit, OnDestroy {
  @Output() alertClick = new EventEmitter<string>();

  isLoading$: Observable<boolean> = this.nxAlertManagementService.selectLoading();
  error$: Observable<DetailedError> = this.nxAlertManagementService.selectError()
    .pipe(map<Error, DetailedError>(err => err ? Object.assign(err, {title: void 0}) : null));
  filteredTableData$: Observable<Array<NxAlertManagement>> = this.nxAlertManagementService.selectFilteredAlerts();
  isEnableBtnDisabled = true;
  isDisabledBtnDisabled = true;
  selectedAlertIds: Array<string> = [];
  statusBarData$: Observable<GridStatusBar>;
  tableFilters: Array<TableFilter>;

  constructor(private notificationService: NotificationService,
              private nxAlertManagementService: NxAlertManagementService) {
    this.nxAlertManagementService.setSortBy('name', 'asc');
  }

  ngOnInit() {
    this.tableFilters = this.nxAlertManagementService.getFilters();

    this.nxAlertManagementService.getAlerts()
      .pipe(untilDestroyed(this))
      .subscribe();

    this.statusBarData$ = this.nxAlertManagementService.selectStatusBarData();

    this.nxAlertManagementService.selectActiveAlerts()
      .pipe(untilDestroyed(this))
      .subscribe((alerts: Array<AlertManagementAlert>) => {
        // reset
        this.isEnableBtnDisabled = true;
        this.isDisabledBtnDisabled = true;
        this.selectedAlertIds = alerts.map((alert: AlertManagementAlert) => {
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
    this.nxAlertManagementService.setActiveAlerts(alertIds);
  }

  handleEnableClick(): void {
    this.updateSelectedAlerts(true);
  }

  handleDisableClick(): void {
    this.updateSelectedAlerts(false);
  }

  updateSelectedAlerts(enabled: boolean): void {
    this.nxAlertManagementService.enabledDisableSelectedAlerts(enabled)
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
      this.nxAlertManagementService.clearSort();
    } else {
      this.nxAlertManagementService.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  handleColumnFilterChanged(filterChanges: Array<FilterChange>): void {
    filterChanges.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.nxAlertManagementService.setFilter(filter.field, filter.term);
      }
    });
  }

  handleGlobalSearchTermChanged(searchTerm: string): void {
    this.nxAlertManagementService.setGlobalFilter(searchTerm);
  }

  handleAlertClick(alertId: string) {
    this.alertClick.emit(alertId);
  }
}
