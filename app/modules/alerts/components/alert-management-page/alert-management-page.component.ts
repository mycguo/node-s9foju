import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewChild
} from '@angular/core';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {Tab} from '../../../shared/components/tabset/tab';
import {AlertManagementNxTableContainer} from '../../containers/alert-management-nx-table/alert-management-nx-table.container';
import {AlertManagementSdwanTableContainer} from '../../containers/alert-management-sdwan-table/alert-management-sdwan-table.container';
import {TabIds} from './alert-management-tab-ids.enum';
import {CommonService} from '../../../../utils/common/common.service';
import {ComponentFactoryHelper} from '../../../../utils/component-factory-helper/component-factory-helper';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {MatSidenav} from '@angular/material/sidenav';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AlertManagementSidebarNxSingleContainer} from '../../containers/alert-management-sidebar-nx-single/alert-management-sidebar-nx-single.container';
import {NxAlertManagementHierarchical} from '../../services/nx-alert-management/models/nx-alert-management-hierarchical';
import {NxAlertManagementService} from '../../services/nx-alert-management/nx-alert-management.service';
import {SdwanAlertManagementService} from '../../services/sdwan-alert-management/sdwan-alert-management.service';
import {AlertSharingConfig} from '../side-bar/sharing/alert-sharing-config';
import {AlertManagementSidebarSdwanContainer} from '../../containers/alert-management-sidebar-sdwan/alert-management-sidebar-sdwan.container';

@UntilDestroy()
@Component({
  selector: 'nx-alert-management-page',
  templateUrl: './alert-management-page.component.html',
  styleUrls: ['./alert-management-page.component.less']
})
export class AlertManagementPageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() isSdwanConfigured: boolean;
  @Input() selectedTab: TabIds;

  @Output() alertClick = new EventEmitter<any>();
  @Output() maintenanceModeClick = new EventEmitter<void>();
  @Output() tabSelected = new EventEmitter<TabIds>();

  @ViewChild('drawer', {static: true}) sidebar: MatSidenav;

  showContent = false;
  selectedTabId: string;
  tabs: Array<Tab>;
  nxTab: Tab;
  sdwanTab: Tab;
  isErrorState: boolean;

  sidebarTitle: string;
  sidebarComponent: ComponentFactoryHelper;

  fatalMessageOverride: LaNoDataMessage;

  // Elements which should prevent the closing sidebar
  public closePreventClassList = ['js-sidebar-ignore'];

  constructor(private commonService: CommonService,
              private nxAlertManagementService: NxAlertManagementService,
              private sdwanAlertManagementService: SdwanAlertManagementService) {
    this.fatalMessageOverride = new LaNoDataMessage('Failed to get alerts configurations', void 0, 'la-no-data-message__icon-no-configurations');
    const nxTabComponentHelper = new ComponentFactoryHelper(AlertManagementNxTableContainer, void 0, ['alertClick']);
    this.nxTab = new Tab(TabIds.LIVE_NX, 'LiveNX Alerts', nxTabComponentHelper);
    const sdwanTabComponentHelper = new ComponentFactoryHelper(AlertManagementSdwanTableContainer, void 0, ['alertClick']);
    this.sdwanTab = new Tab(TabIds.VMANAGE, 'Cisco SD-WAN Integrations', sdwanTabComponentHelper);
  }

  ngOnInit(): void {
    this.nxTab.componentHelper.getOutput('alertClick')
      .pipe(untilDestroyed(this))
      .subscribe((alertId: string) => {
        this.openNxSidebar(alertId);
      });
    this.sdwanTab.componentHelper.getOutput('alertClick')
      .pipe(untilDestroyed(this))
      .subscribe((alertId: string) => {
        this.openSdwanSidebar(alertId);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.isSdwanConfigured?.currentValue)) {
      const isSdwanConfigured: boolean = changes.isSdwanConfigured.currentValue;
      this.showContent = true;
      if (isSdwanConfigured) {
        this.tabs = [this.nxTab, this.sdwanTab];
      } else {
        this.tabs = [this.nxTab];
      }
      this.selectedTabId = this.selectedTab;
    }
    if (changes.selectedTab?.currentValue != null && this.tabs != null && this.tabs.length > 0 &&
      this.tabIdExists(this.tabs, changes.selectedTab.currentValue)) {
      this.selectedTabId = changes.selectedTab.currentValue;
    }
  }

  ngOnDestroy() {
    this.nxTab.componentHelper.cleanup();
    this.sdwanTab.componentHelper.cleanup();
  }

  handleTabSelected(tabId: string): void {
    // this.closeSidebar();
    if (tabId === TabIds.LIVE_NX) {
      this.tabSelected.emit(TabIds.LIVE_NX);
    } else if (tabId === TabIds.VMANAGE) {
      this.tabSelected.emit(TabIds.VMANAGE);
    }
  }

  openNxSidebar(alertId: string): void {
    const alert = this.nxAlertManagementService.findAlert(alertId);
    if (alert != null) {

      // Open hierarchical alert details sidebar
      if (alert instanceof NxAlertManagementHierarchical) {

        // Close non-hierarchical alert details sidebar
        if (this.sidebar?.opened) {
          this.closeSidebar();
        }

        // currently emits to angularjs
        this.alertClick.emit(this.nxAlertManagementService.getLaAlertViewModel(alert.id));

        // Open non-hierarchical alert details sidebar
      } else {

        // Close hierarchical alert details sidebar
        this.alertClick.emit(this.nxAlertManagementService.getLaAlertViewModel(void 0));

        this.sidebarTitle = alert.name;
        const component: Type<any> = AlertManagementSidebarNxSingleContainer;
        this.sidebarComponent = new ComponentFactoryHelper(
          component,
          {
            alert: alert
          },
          ['closeSidebar']
        );
        this.sidebarComponent.getOutput('closeSidebar')
          .pipe(untilDestroyed(this))
          .subscribe(() => this.closeSidebar());
        this.sidebar.open().then(r => void 0);
      }
    }
  }

  openSdwanSidebar(alertId: string): void {
    const alert = this.sdwanAlertManagementService.findAlert(alertId);
    if (alert != null) {
      this.sidebarTitle = alert.name;
      const component: Type<any> = AlertManagementSidebarSdwanContainer;
      this.sidebarComponent = new ComponentFactoryHelper(
        component,
        {
          alert: alert
        },
        ['closeSidebar']
      );
      this.sidebarComponent.getOutput('closeSidebar')
        .pipe(untilDestroyed(this))
        .subscribe(() => this.closeSidebar());
      this.sidebar.open().then(r => void 0);
    }
  }

  closeSidebar(): void {
    this.sidebar.close().then(r => void 0);
  }

  private tabIdExists(tabs: Array<Tab>, tabId: string): boolean {
    return tabs.map(({id}) => id).includes(tabId);
  }
}
