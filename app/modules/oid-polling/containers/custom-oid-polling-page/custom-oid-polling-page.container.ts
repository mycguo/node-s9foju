import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomOidPollingService } from '../../services/custom-oid-polling/custom-oid-polling.service';
import { Observable } from 'rxjs';
import { GridStatusBar } from '../../../grid/components/grid-status-bar/grid-status-bar';
import { GridColumnSort } from '../../../grid/models/grid-column-sort';
import { LaNoDataMessage } from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import { DisplayError } from '../../../shared/components/loading/enums/display-error.enum';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { LaClientError } from '../../../../../../../client/nxComponents/models/LaClientError';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogInterface } from '../../../shared/components/confirm-dialog/confirm-dialog.interface';
import { Size } from '../../../shared/enums/size';
import DetailedError from '../../../shared/components/loading/detailed-error';
import CustomOidPolling from '../../services/custom-oid-polling/models/custom-oid-polling';
import FilterChange from '../../../grid/components/filters/filter-change';
import { take } from 'rxjs/operators';
import { CustomOidPollingModalComponent } from '../../components/custom-oid-polling-modal/custom-oid-polling-modal.component';

@UntilDestroy()
@Component({
  selector: 'nx-custom-oid-polling-page-container',
  template: `
    <nx-loading
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [displayError]="displayError"
      [showContent]="showContent"
      [fatalMessageOverride]="fatalMessageOverride"
      [contentTemplate]="contentTemplate">
      <ng-template #contentTemplate>
        <nx-custom-oid-polling-page
          [data]="data$ | async"
          [selectedIds]="selectedIds$ | async"
          [statusBarData]="statusBarData$ | async"
          [isEditBtnDisabled]="(statusBarData$ | async)?.selectedRows !== 1"
          [isDeleteBtnDisabled]="(statusBarData$ | async)?.selectedRows === 0"
          (columnFilterChanged)="columnFilterChanged($event)"
          (globalSearchTermChanged)="globalSearchTermChanged($event)"
          (columnSortChanged)="columnSortChanged($event)"
          (rowIdsSelected)="rowIdsSelected($event)"
          (addBtnClicked)="addBtnClicked()"
          (editBtnClicked)="editBtnClicked($event)"
          (deleteBtnClicked)="deleteBtnClicked()"
        ></nx-custom-oid-polling-page>
      </ng-template>
    </nx-loading>
  `,
  styles: [':host {display: block}'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class CustomOidPollingPageContainer implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  data$: Observable<CustomOidPolling[]>;
  selectedIds$: Observable<string[]>;
  statusBarData$: Observable<GridStatusBar>;
  showContent: boolean;
  displayError: DisplayError;
  fatalMessageOverride: LaNoDataMessage;
  noDataMessages: { [key: string]: LaNoDataMessage };

  constructor(
    private customOidPollingService: CustomOidPollingService,
    private notificationService: NotificationService,
    public dialog: DialogService,
  ) {
    this.isLoading$ = this.customOidPollingService.selectLoading();
    this.error$ = this.customOidPollingService.selectError();
    this.data$ = this.customOidPollingService.selectFilteredGroups();
    this.statusBarData$ = this.customOidPollingService.selectStatusBarData();
    this.selectedIds$ = this.customOidPollingService.selectFilteredActiveRows();

    this.noDataMessages = {
      noData: new LaNoDataMessage(
        'You have not created any OIDs yet',
        void 0,
        'la-no-data-message__icon-no-data-2',
        [{
          text: 'Add Custom OID',
          action: () => this.addBtnClicked(),
          primary: true
        }]
      ),
      fatalError: new LaNoDataMessage(
        'Error occurred while requesting data',
        void 0,
        'la-no-data-message__icon-warning'
      )
    };
  }

  ngOnInit(): void {
    this.getCustomOids();
  }

  ngOnDestroy(): void {
    this.customOidPollingService.reset();
  }

  addBtnClicked(): void {
    this.openModal();
  }

  editBtnClicked(id: string): void {
    const customOid: CustomOidPolling = id === void 0 ?
      this.customOidPollingService.getActiveRow() :
      this.customOidPollingService.getEntity(id);

    if (customOid === void 0) {
      return;
    }
    this.openModal(customOid);
  }

  deleteBtnClicked(): void {
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: `Delete Custom OID`,
          message: `Are you sure you want to delete custom OID?`,
          confirmButtonMessage: 'Delete'
        } as ConfirmDialogInterface,
        size: Size.SM
      },
      (hasConfirmed) => {
        if (hasConfirmed) {
          this.deleteCustomOids();
        }
      }
    );
  }

  private openModal(customOid?: CustomOidPolling): void {
    this.dialog.open(
      CustomOidPollingModalComponent,
      {
        size: Size.LG,
        data: {
          ...customOid
        }
      },
      (result) => {
        if (result === void 0) {
          return;
        }

        this.getCustomOids();

        if (result.error) {
          this.displayNotificaton(new LaClientError(result.error).message, NOTIFICATION_TYPE_ENUM.ALERT);
          return;
        }

        const successMessage = customOid === void 0 ?
          'Custom OID successfully added' :
          'Custom OID successfully updated';
        this.displayNotificaton(successMessage, NOTIFICATION_TYPE_ENUM.SUCCESS);
      }
    );
  }

  columnFilterChanged(filterChange: FilterChange[]): void {
    filterChange.forEach((filter: FilterChange) => {
      if (filter.field !== void 0) {
        this.customOidPollingService.setFilter(filter.field, filter.term);
      }
    });
  }

  globalSearchTermChanged(searchTerm: string): void {
    this.customOidPollingService.setGlobalFilter(searchTerm);
  }

  columnSortChanged(change: GridColumnSort): void {
    if (change === void 0) {
      this.customOidPollingService.clearSort();
    } else {
      this.customOidPollingService.setSortBy(change.colId, change.sort, change.customSortFn);
    }
  }

  rowIdsSelected(event) {
    this.customOidPollingService.setActiveRows(event);
  }

  private getCustomOids(): void {
    this.customOidPollingService.getCustomOidPolling()
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe(customOids => {
        if (customOids.length === 0) {
          this.fatalMessageOverride = this.noDataMessages.noData;
          this.displayError = DisplayError.FATAL;
          this.showContent = false;
          return;
        }
        this.showContent = true;
      }, () => {
        this.fatalMessageOverride = this.noDataMessages.fatalError;
        this.displayError = DisplayError.FATAL;
      });
  }

  private deleteCustomOids(): void {
    this.customOidPollingService.deleteCustomOids()
      .pipe(
        take(1)
      )
      .subscribe(ids => {
          this.getCustomOids();
          this.displayNotificaton(
            `${ids.length > 1 ? ids.length + ' ' : ''}Custom OID${ids.length > 1 ? 's' : ''} successfully deleted`,
            NOTIFICATION_TYPE_ENUM.SUCCESS
          );
        },
        (error) => {
          this.displayNotificaton(new LaClientError(error).message, NOTIFICATION_TYPE_ENUM.ALERT);
        }
      );
  }

  private displayNotificaton(message: string, type: NOTIFICATION_TYPE_ENUM): void {
    this.notificationService.sendNotification$(
      new LaCustomNotificationDefinition(
        message,
        type
      )
    );
  }

}
