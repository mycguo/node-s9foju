import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectableTreeFlatNode } from '../../../shared/components/selectable-tree/selectable-tree-flat-node';
import { Observable } from 'rxjs';
import { SelectableTreeNode } from '../../../shared/components/selectable-tree/selectable-tree-node';
import { ReportsAccessManagementService } from '../../../reporting/services/reports-access-management/reports-access-management.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take, tap } from 'rxjs/operators';
import { NotificationService } from '../../../../services/notification-service/notification.service';
import { NotificationDowngradeService } from '../../../../services/notification-downgrade/notification-downgrade.service';
import { NOTIFICATION_TYPE_ENUM } from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import { LaClientError } from '../../../../../../../client/nxComponents/models/LaClientError';

@UntilDestroy()
@Component({
  selector: 'nx-reports-access-management-container',
  template: `
    <nx-loading
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [showContent]="true"
      [contentTemplate]="content"
    >
      <ng-template #content>
        <nx-reports-access-management
          [treeData]="treeData$ | async"
          [unselectAllDisabled]="unselectAllDisabled$ | async"
          [selectAllDisabled]="selectAllDisabled"
          (searchChange)="handleSearch($event)"
          (treeSelect)="handleTreeSelect($event)"
          (selectAll)="handleSelectAll()"
          (unselectAll)="handleUnselectAll()"
          (submit)="handleSubmit()"
        ></nx-reports-access-management>
      </ng-template>
    </nx-loading>
  `,
  styles: [':host { display: block; height: 100%; }'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class ReportsAccessManagementContainer implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  treeData$: Observable<SelectableTreeNode[]>;

  selectAllDisabled: boolean;
  unselectAllDisabled$: Observable<boolean>;

  constructor(
    private reportsAccessManagementService: ReportsAccessManagementService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.reportsAccessManagementService.selectLoading();
    this.error$ = this.reportsAccessManagementService.selectError();
    this.treeData$ = this.reportsAccessManagementService.selectVisibleReports()
      .pipe(
        tap((tree) => {
          this.selectAllDisabled = tree.every((treeElement) => treeElement.enabled);
        })
      );
    this.unselectAllDisabled$ = this.reportsAccessManagementService.isAllUnselected();
    this.getReports();
  }

  ngOnDestroy(): void {
    this.reportsAccessManagementService.reset();
  }

  handleSelectAll() {
    this.reportsAccessManagementService.changeReportsSelectedStatus(true);
  }

  handleUnselectAll() {
    this.reportsAccessManagementService.changeReportsSelectedStatus(false);
  }

  handleTreeSelect(nodes: SelectableTreeFlatNode[]) {
    const status = nodes[0].selected;
    const nodesIds = nodes.map(({ id }) => id);
    this.reportsAccessManagementService.updateReports(nodesIds, status);
  }

  handleSearch(searchString: string) {
    this.reportsAccessManagementService.updateSearch(searchString);
  }

  handleSubmit() {
    this.reportsAccessManagementService.putRestrictedReports()
      .pipe(
        take(1),
        untilDestroyed(this)
      )
      .subscribe((resp) => {
        this.getReports();
        this.displayNotification('Restricted reports successfully updated', NOTIFICATION_TYPE_ENUM.SUCCESS);
      }, (error) => {
        this.displayNotification(new LaClientError(error).message, NOTIFICATION_TYPE_ENUM.ALERT);
      });
  }

  private displayNotification(message: string, type: NOTIFICATION_TYPE_ENUM): void {
    this.notificationService.sendNotification$(
      new LaCustomNotificationDefinition(
        message,
        type
      )
    );
  }

  private getReports(): void {
    this.reportsAccessManagementService.getReports()
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe();
  }
}
