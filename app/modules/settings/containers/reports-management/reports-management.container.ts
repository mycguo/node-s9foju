import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportsManagement} from '../../services/reports-management/models/reports-management';
import {ReportsManagementService} from '../../services/reports-management/reports-management.service';
import {NotificationService} from '../../../../services/notification-service/notification.service';
import {NotificationDowngradeService} from '../../../../services/notification-downgrade/notification-downgrade.service';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import FilterChange from '../../../grid/components/filters/filter-change';
import {GridColumnSort} from '../../../grid/models/grid-column-sort';
import {DialogService} from '../../../shared/services/dialog/dialog.service';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {ConfirmDialogInterface} from '../../../shared/components/confirm-dialog/confirm-dialog.interface';
import {ReportsManagementModalComponent} from '../../components/reports-management-modal/reports-management-modal.component';
import {Size} from '../../../shared/enums/size';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@UntilDestroy()
@Component({
  selector: 'nx-reports-management-container',
  template: `
    <nx-loading
      [isLoading]="selectLoading$ | async"
      [error]="selectError$ | async"
      [showContent]="true"
      [contentTemplate]="content">
      <ng-template #content>
        <nx-card size="full" headerTitle="Reports Management" [body]="cardBody">
          <ng-template #cardBody>
            <nx-reports-management
              [data]="data$ | async"
              [selectedIds]="selectedIds$ | async"
              [statusBarData]="statusBarData$ | async"
              [isReassignBtnDisabled]="(statusBarData$ | async)?.selectedRows === 0 || reportsUpdating"
              [isDeleteBtnDisabled]="(statusBarData$ | async)?.selectedRows === 0 || reportsUpdating"
              [disableGrid]="reportsUpdating"
              (columnFilterChanged)="columnFilterChanged($event)"
              (columnSortChanged)="columnSortChanged($event)"
              (rowIdsSelected)="rowIdsSelected($event)"
              (reassignBtnClicked)="reassignBtnClicked($event)"
              (deleteBtnClicked)="deleteBtnClicked()"
            ></nx-reports-management>
          </ng-template>
        </nx-card>
        <nx-updating-data-message
          *ngIf="reportsUpdating"
          message="Report ownership transfer is in progress. Please wait."
        ></nx-updating-data-message>
      </ng-template>
    </nx-loading>
  `,
  styles: [':host { display: block; }'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class ReportsManagementContainer implements OnInit, OnDestroy {

  selectLoading$: Observable<boolean>;
  selectError$: Observable<DetailedError>;
  data$: Observable<ReportsManagement[]>;
  selectedIds$: Observable<string[]>;
  statusBarData$: Observable<GridStatusBar>;
  reportsUpdating: boolean;

  constructor(
    private reportsManagementService: ReportsManagementService,
    private notificationService: NotificationService,
    public dialog: DialogService
  ) {
    this.selectLoading$ = this.reportsManagementService.selectLoading();
    this.selectError$ = this.reportsManagementService.selectError();
    this.data$ = this.reportsManagementService.selectFilteredGroups();
    this.selectedIds$ = this.reportsManagementService.selectFilteredActiveRows();
    this.statusBarData$ = this.reportsManagementService.selectStatusBarData();
  }

  ngOnInit(): void {
    this.getReportsManagementList();
  }

  ngOnDestroy(): void {
    this.reportsManagementService.reset();
  }

  reassignBtnClicked(reportId: string): void {
    this.dialog.open(
      ReportsManagementModalComponent,
      {
        size: Size.SM
      },
      (result: {userName: string}) => {
        if (result === void 0) {
          return;
        }
        const reportsData: ReportsManagement[] = reportId === void 0 ?
          this.reportsManagementService.getActiveRows() :
          [this.reportsManagementService.getEntity(reportId)];

        this.reassignReports(reportsData, result.userName);
      }
    );
  }

  deleteBtnClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Delete Reports`,
        message: `Are you sure you want to delete selected report template(s)?`,
        confirmButtonMessage: 'Delete'
      } as ConfirmDialogInterface,
      panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_sm']
    });

    dialogRef.afterClosed().pipe(
      take(1)
    ).subscribe((hasConfirmed: boolean) => {
      if (hasConfirmed) {
        this.deleteReports();
      }
    });
  }

  /**
   * table handlers
   */
  columnFilterChanged(filterChange: FilterChange[]): void {
    filterChange.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.reportsManagementService.setFilter(filter.field, filter.term);
      }
    });
  }

  columnSortChanged(change: GridColumnSort): void {
    if (change === void 0) {
      this.reportsManagementService.clearSort();
    } else {
      this.reportsManagementService.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  rowIdsSelected(event: string[]) {
    this.reportsManagementService.setActiveRows(event);
  }

  private getReportsManagementList(): void {
    this.reportsManagementService.getReportsManagementList()
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe();
  }

  private reassignReports(reports: ReportsManagement[], owner: string): void {
    const ids = reports.map(report => report.id);
    this.reportsUpdating = true;
    this.reportsManagementService.reassignTemplates(ids, owner)
      .pipe(take(1))
      .subscribe(() => {
        this.reportsUpdating = false;
        this.getReportsManagementList();

        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            `${ids.length} template${ids.length > 1 ? 's' : ''} successfully reassigned`,
            NOTIFICATION_TYPE_ENUM.SUCCESS
          )
        );
      }, (err => {
      this.reportsUpdating = false;
        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            err.message,
            NOTIFICATION_TYPE_ENUM.ALERT
          )
        );
      })
    );
  }

  private deleteReports(): void {
    const ids = this.reportsManagementService.getActiveRows().map(row => row.id);
    this.reportsManagementService.deleteTemplates(ids)
      .pipe(take(1))
      .subscribe(() => {
          this.getReportsManagementList();
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              `${ids.length} template${ids.length > 1 ? 's' : ''} successfully deleted`,
              NOTIFICATION_TYPE_ENUM.SUCCESS
            )
          );
        }, (err => {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              err.message,
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
        })
      );
  }
}
