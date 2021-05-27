import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {map, take} from 'rxjs/operators';
import { ApplicationGroupsModalComponent } from '../../components/application-groups-modal/application-groups-modal.component';
import FilterChange from '../../../grid/components/filters/filter-change';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import { ApplicationGroupsService } from '../../services/application-groups/application-groups.service';
import ApplicationGroup from '../../models/application-group';
import { LaNoDataMessage } from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogInterface } from '../../../shared/components/confirm-dialog/confirm-dialog.interface';
import { ApplicationGroupModalData } from '../../models/application-group-modal-data';
import { DisplayError } from '../../../shared/components/loading/enums/display-error.enum';
import { ModalActionType } from '../../../shared/enums/modal-action-type.enum';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { Size } from '../../../shared/enums/size';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';

@Component({
  selector: 'nx-application-groups-container',
  template: `
    <nx-loading
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [displayError]="displayError"
      [showContent]="showContent"
      [fatalMessageOverride]="fatalMessageOverride"
      [contentTemplate]="contentTemplate">
      <ng-template #contentTemplate>
        <nx-application-groups-table
          [data]="data$ | async"
          [selectedIds]="selectedIds$ | async"
          [isEditBtnDisabled]="(statusBarData$ | async)?.selectedRows !== 1"
          [isDeleteBtnDisabled]="(statusBarData$ | async)?.selectedRows === 0"
          [statusBarData]="statusBarData$ | async"
          (columnFilterChanged)="columnFilterChanged($event)"
          (globalSearchTermChanged)="globalSearchTermChanged($event)"
          (columnSortChanged)="columnSortChanged($event)"
          (rowIdsSelected)="rowIdsSelected($event)"
          (addBtnClicked)="addBtnClicked()"
          (editBtnClicked)="editBtnClicked($event)"
          (deleteBtnClicked)="deleteBtnClicked()"
        ></nx-application-groups-table>
      </ng-template>
    </nx-loading>
  `,
  styles: [],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class ApplicationGroupsContainer implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  data$: Observable<ApplicationGroup[]>;
  selectedIds$: Observable<string[]>;
  statusBarData$: Observable<GridStatusBar>;
  showContent: boolean;
  displayError: DisplayError;
  fatalMessageOverride: LaNoDataMessage;
  noDataMessages: {[key: string]: LaNoDataMessage};
  MODAL_ACTION_TYPE_ENUM: typeof ModalActionType = ModalActionType;

  constructor(
    private applicationGroupsService: ApplicationGroupsService,
    private notificationService: NotificationService,
    public dialog: DialogService
  ) {
    this.isLoading$ = this.applicationGroupsService.selectLoading();
    this.error$ = this.applicationGroupsService.selectError();
    this.data$ = this.applicationGroupsService.selectFilteredGroups();
    this.selectedIds$ = this.applicationGroupsService.selectFilteredActiveRows();
    this.statusBarData$ = this.applicationGroupsService.selectStatusBarData();

    this.noDataMessages = {
      noData: new LaNoDataMessage(
        'You have not added any application groups yet',
        void 0,
        'la-no-data-message__icon-no-data-2',
        [{
          text: 'Add Application Group',
          action: () => this.addBtnClicked(),
          primary: true
        }]
      ),
      fatalError: new LaNoDataMessage(
        'Error occured while requesting data',
        void 0,
        'la-no-data-message__icon-warning'
      )
    };
  }

  ngOnInit(): void {
    this.getApplicationGroups();
  }

  ngOnDestroy(): void {
    this.applicationGroupsService.reset();
  }

  addBtnClicked(): void {
    this.openModal(ModalActionType.ADD);
  }

  editBtnClicked(appId: string): void {
    const appData: ApplicationGroup = appId === void 0 ?
      this.applicationGroupsService.getActiveRow() :
      this.applicationGroupsService.getEntity(appId);

    if (appData === void 0) {
      return;
    }
    this.openModal(ModalActionType.EDIT, appData);
  }

  openModal(mode: ModalActionType, appGroup?: ApplicationGroup): void {
    this.dialog.open(
      ApplicationGroupsModalComponent,
      {
        size: Size.SM,
        data: <ApplicationGroupModalData>{
          'mode': mode,
          appGroupNames: this.applicationGroupsService.getAllGroupNames(),
          appGroup: appGroup
        }
      },
      (result) => {
        if (result === void 0) {
          return;
        }

        this.getApplicationGroups();

        if (result.error) {
          this.notificationService.sendNotification$(
            new LaCustomNotificationDefinition(
              result.error.message ?? 'An error occured',
              NOTIFICATION_TYPE_ENUM.ALERT
            )
          );
          return;
        }

        const successMessage = mode === ModalActionType.ADD ? `Application group '${result.name}' added successfully` : `Application group '${result.name}' updated successfully`;
        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            successMessage,
            NOTIFICATION_TYPE_ENUM.SUCCESS
          )
        );
      }
    );
  }

  deleteBtnClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Delete Application Groups`,
        message: `Are you sure you want to delete application groups?`,
        confirmButtonMessage: 'Delete'
      } as ConfirmDialogInterface,
      panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_sm']
    });

    dialogRef.afterClosed().pipe(
        take(1)
      ).subscribe((hasConfirmed: boolean) => {
      if (hasConfirmed) {
        this.deleteApplicationGroups();
      }
    });
  }

  columnFilterChanged(filterChange: FilterChange[]): void {
    filterChange.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.applicationGroupsService.setFilter(filter.field, filter.term);
      }
    });
  }

  globalSearchTermChanged(searchTerm: string): void {
    this.applicationGroupsService.setGlobalFilter(searchTerm);
  }

  columnSortChanged(change: GridColumnSort): void {
    if (change === void 0) {
      this.applicationGroupsService.clearSort();
    } else {
      this.applicationGroupsService.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  rowIdsSelected(event: string[]) {
    this.applicationGroupsService.setActiveRows(event);
  }

  private getApplicationGroups(): void {
    this.applicationGroupsService.getApplicationGroups().pipe(
      take(1)
    ).subscribe((appGroups) => {
        if (appGroups === void 0 || appGroups.length === 0) {
          this.fatalMessageOverride = this.noDataMessages.noData;
          this.displayError = DisplayError.FATAL;
          this.showContent = false;
          return;
        }
        this.showContent = true;
      },
      () => {
        this.fatalMessageOverride = this.noDataMessages.fatalError;
        this.displayError = DisplayError.FATAL;
      }
    );
  }

  private deleteApplicationGroups(): void {
    this.applicationGroupsService.deleteApplicationGroups()
      .pipe(
        take(1)
      )
      .subscribe(ids => {
        this.getApplicationGroups();
        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            `${ids.length} group${ids.length > 1 ? 's' : ''} successfully deleted`,
            NOTIFICATION_TYPE_ENUM.SUCCESS
          )
        );
      },
      (err) => {
        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            err.message,
            NOTIFICATION_TYPE_ENUM.ALERT
          )
        );
      }
    );
  }

}
