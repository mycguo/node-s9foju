import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LiveInsightEdgeConfigModalContainer} from '../../containers/live-insight-edge-config-modal-container/live-insight-edge-config-modal.container';
import {LiveInsightEdgeAddDeviceModalContainer} from '../../containers/live-insight-edge-add-device-modal/live-insight-edge-add-device-modal.container';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import AnalyticsPlatformModel from 'src/app/modules/integrations/components/analytics-platform/analytics-platform.model';
import {SPINNER_SIZE} from '../../../shared/components/spinner/spinnerSize';
import {SPINNER_POSITION} from '../../../shared/components/spinner/spinnerPosition';
import {renderDialogOpen} from '../../../../utils/component-helpers/component-helpers';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ComponentFactoryHelper} from '../../../../utils/component-factory-helper/component-factory-helper';
import {Tab} from '../../../shared/components/tabset/tab';
import {LiveInsightEdgePageTabId} from './models/live-insight-edge-page-tab-id';
import {LiveInsightEdgeMonitoredDevicesContainer} from '../../containers/live-insight-edge-monitored-devices/live-insight-edge-monitored-devices.container';
// @ts-ignore
import {LiveInsightEdgeMonitoredApplicationGroupsContainer} from '../../containers/live-insight-edge-monitored-application-groups/live-insight-edge-monitored-application-groups.container';
import {LiveInsightEdgeAddApplicationGroupModalContainer} from '../../containers/live-insight-edge-add-application-group-modal/live-insight-edge-add-application-group-modal.container';
import {LiveInsightEdgeDataSourceModalComponent} from '../live-insight-edge-data-source-modal/live-insight-edge-data-source-modal.component';
import {DialogService} from 'src/app/modules/shared/services/dialog/dialog.service';
import {NotificationService} from 'src/app/services/notification-service/notification.service';
import {NotificationDowngradeService} from 'src/app/services/notification-downgrade/notification-downgrade.service';
import LaCustomNotificationDefinition from '../../../../../../../client/nxuxComponents/services/laCustomNotifications/LaCustomNotificationDefinition';
import {NOTIFICATION_TYPE_ENUM} from '../../../../../../../client/nxuxComponents/components/laCustomNotifications/laCustomNotificationsTypesEnum';

@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-page',
  templateUrl: './live-insight-edge-page.component.html',
  styleUrls: ['./live-insight-edge-page.component.less'],
  providers: [{
    provide: NotificationService,
    useExisting: NotificationDowngradeService
  }]
})
export class LiveInsightEdgePageComponent implements OnInit, OnChanges, OnDestroy {

  @Input() configModalIsOpen: boolean;
  @Input() doesConfigurationExist = false;
  @Input() addDevicesModelIsOpen: boolean;
  @Input() addAppGroupModelIsOpen: boolean;
  @Input() configData: AnalyticsPlatformModel;
  @Input() isCheckingConfiguration = true;

  @Output() openConfigClick = new EventEmitter();
  @Output() openAddDevicesClick = new EventEmitter();
  @Output() deleteConfigurationClick = new EventEmitter();
  @Output() checkConnectionStatusClick = new EventEmitter();
  @Output() configModalClosed = new EventEmitter();
  @Output() addDeviceModalClosed = new EventEmitter();
  @Output() addAppGroupModalClosed = new EventEmitter();

  private configDialogRef: MatDialogRef<LiveInsightEdgeConfigModalContainer>;
  private addDevicesDialogRef: MatDialogRef<LiveInsightEdgeAddDeviceModalContainer>;
  private addAppGroupDialogRef: MatDialogRef<LiveInsightEdgeAddApplicationGroupModalContainer>;

  SPINNER_SIZE = SPINNER_SIZE;
  SPINNER_POSITION = SPINNER_POSITION;

  selectedTabId: string;
  tabs: Array<Tab>;

  noDataModel: LaNoDataMessage = {
    icon: 'la-no-data-message__icon-no-configurations',
    title: 'There is no connected LiveNA system. ',
    buttons: [{
      text: 'Connect LiveNA',
      primary: true,
      action: () => {
        this.handleOpenConfigClick();
      }
    }]
  };

  constructor(public dialog: MatDialog,
              private dialogService: DialogService,
              private notificationService: NotificationService) {
    const deviceTabHelper = new ComponentFactoryHelper(LiveInsightEdgeMonitoredDevicesContainer);
    const deviceTab = new Tab(LiveInsightEdgePageTabId.DEVICE, 'Monitored Devices', deviceTabHelper);

    const appGroupTabHelper = new ComponentFactoryHelper(LiveInsightEdgeMonitoredApplicationGroupsContainer);
    const appGroupTab = new Tab(LiveInsightEdgePageTabId.DEVICE, 'Monitored Applications', appGroupTabHelper);

    this.tabs = [deviceTab, appGroupTab];
    this.selectedTabId = LiveInsightEdgePageTabId.DEVICE;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configModalIsOpen != null) {
      if (changes.configModalIsOpen.currentValue === true) {
        this.openConfigModal();
      } else {
        this.closeConfigModal();
      }
    }
    if (changes.addDevicesModelIsOpen != null) {
      if (changes.addDevicesModelIsOpen.currentValue === true) {
        this.openAddDevicesModal();
      } else {
        this.closeAddDevicesModal();
      }
    }
    if (changes.addAppGroupModelIsOpen != null) {
      if (changes.addAppGroupModelIsOpen.currentValue === true) {
        this.openAddAppGroupModal();
      } else {
        this.closeAddAppGroupModal();
      }
    }
  }

  openConfigModal() {
    renderDialogOpen(() => {
      this.configDialogRef = this.dialog.open(LiveInsightEdgeConfigModalContainer, {
        data: {},
        panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_sm'],
        id: 'liveinsight-config-modal',
      });
      this.configDialogRef.afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.configModalClosed.emit();
        });
    });
  }

  closeConfigModal() {
    if (this.configDialogRef != null) {
      this.configDialogRef.close();
      this.configDialogRef = void 0;
    }
  }

  openAddDevicesModal() {
    renderDialogOpen(() => {
      this.addDevicesDialogRef = this.dialog.open(LiveInsightEdgeAddDeviceModalContainer, {
        panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_md'],
        data: {}
      });
      this.addDevicesDialogRef.afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.addDeviceModalClosed.emit();
        });
    });
  }

  closeAddDevicesModal() {
    if (this.addDevicesDialogRef != null) {
      this.addDevicesDialogRef.close();
      this.addDevicesDialogRef = void 0;
    }
  }

  openAddAppGroupModal() {
    renderDialogOpen(() => {
      this.addAppGroupDialogRef = this.dialog.open(LiveInsightEdgeAddApplicationGroupModalContainer, {
        panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_md'],
        data: {}
      });
      this.addAppGroupDialogRef.afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.addAppGroupModalClosed.emit();
        });
    });
  }

  closeAddAppGroupModal() {
    if (this.addAppGroupDialogRef != null) {
      this.addAppGroupDialogRef.close();
      this.addAppGroupDialogRef = void 0;
    }
  }

  handleOpenConfigClick() {
    this.openConfigClick.emit();
  }

  openEditDataSourceModal() {
    this.dialogService.open(LiveInsightEdgeDataSourceModalComponent, {
      panelClass: ['nx-modal-wrapper', 'nx-modal-wrapper_size_sm'],
      data: null
    },
    (result) => {
      if (result === void 0) {
        return;
      }

      if (result.error) {
        this.notificationService.sendNotification$(
          new LaCustomNotificationDefinition(
            result.error.message ?? 'An error occurred.',
            NOTIFICATION_TYPE_ENUM.ALERT
          )
        );
        return;
      }

      this.notificationService.sendNotification$(
        new LaCustomNotificationDefinition(
          'Data Source successfully updated.',
          NOTIFICATION_TYPE_ENUM.SUCCESS
        )
      );
    }
    );
  }

  ngOnDestroy(): void {
  }
}
