import {Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import User from '../../services/user/user.model';
import {WindowRefService} from '../../services/windowRef/windowRef.service';
import NxLicense from '../../services/license/nxLicense.model';
import * as _ from 'lodash';
import {NotificationSidebarService} from '../../services/notification-sidebar/notification-sidebar.service';

@Component({
  selector: 'nx-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.less'],
})
export class AppbarComponent implements OnInit, OnChanges {

  // input?
  activeTabId: string;
  // input?
  @Input() uxState: string; // this should be 'setup' or 'ux-dashboard'
  // input?
  @Input() unreadNotificationsIndicatorCount = 0;

  parentApp: string;

  // move somewhere else?
  liveUxState: string;

  @Input() user: User;
  @Input() showUxAgentSummary: boolean; // this is false if license.nullLicense == true
  @Input() nxLicense: NxLicense;

  @Output() tabSelected = new EventEmitter<string>();
  @Output() notificationMenuClicked = new EventEmitter();

  readonly webstartUrl;
  readonly restApiUrl;
  readonly walkmeUser = 'walkmeUser'; // TODO: this is a generated string req the license service

  // state
  activeHeaderNavItem: string;
  showUxAppNav = false;
  // NX+ is "dormant". It will need additional services if needing to be activated.
  showNxPlusAppNav = false;
  showSupportPortalOption = false;

  constructor(
    private windowRef: WindowRefService
  ) {
    this.webstartUrl = `${windowRef.generateServerBaseUrl()}:8092/webstart/client.jnlp`;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nxLicense && !_.isNil(changes.nxLicense.currentValue)) {
      const currentNxLicense = <NxLicense>changes.nxLicense.currentValue;
      this.showUxAppNav = currentNxLicense.isCloudLicense && currentNxLicense.maxAgentCount > 0;
      this.showSupportPortalOption = currentNxLicense.isCloudLicense;
    }
  }

  isActiveHeaderTab(tabId: string) {
    return this.activeTabId === tabId;
  }

  selectTab(tabId: string) {
    this.tabSelected.emit(tabId);
  }

  toggleNotificationWindow() {
    this.notificationMenuClicked.emit();
  }

  setActiveHeaderNav(navId: string) {
    this.activeHeaderNavItem = navId;
  }

  toggleMenu(shouldOpen: boolean) {
  }

  onClickOutside() {
    this.setActiveHeaderNav(null);
  }

}
