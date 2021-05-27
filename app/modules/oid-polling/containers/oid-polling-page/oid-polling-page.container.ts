import { Component, Inject, OnInit } from '@angular/core';
import { $STATE } from '../../../../ajs-upgraded-providers';
import { Tab } from '../../../shared/components/tabset/tab';
import { ComponentFactoryHelper } from '../../../../utils/component-factory-helper/component-factory-helper';
import { CustomOidPollingPageContainer } from '../custom-oid-polling-page/custom-oid-polling-page.container';
import { PreConfiguredOidPollingPageContainer } from '../pre-configured-oid-polling-page/pre-configured-oid-polling-page.container';

enum OidPollingPageTabIds {
  PRE_CONFIGURED = 'PRE_CONFIGURED',
  CUSTOM = 'CUSTOM',
}

@Component({
  selector: 'nx-oid-polling-page-container',
  template: `
    <nx-title-bar
      pageTitle="OID Polling"
      [pageActions]="pageActions"
    ></nx-title-bar>
    <ng-template #pageActions>
      <nx-button
        class="nx-title-bar-action"
        (btnClick)="navigateToAlertsPage()"
      >
        Configure OID Alerts
      </nx-button>
    </ng-template>
    <nx-tabset
      [tabGroup]="tabs"
      [selectedTabId]="selectedTabId"
      (tabSelected)="handleTabSelected($event)"
    ></nx-tabset>
  `,
  styles: [':host {display: block}']
})
export class OidPollingPageContainer implements OnInit {

  tabs: Array<Tab>;
  tabIds = OidPollingPageTabIds;
  selectedTabId: string;

  constructor(
    @Inject($STATE) private $state: any
  ) {
    this.selectedTabId = this.$state.params?.tabId || OidPollingPageTabIds.PRE_CONFIGURED;
  }

  navigateToAlertsPage(): void {
    this.$state.go('nxSettings.alerting');
  }

  handleTabSelected(tabId: string): void {
    this.$state.go(this.$state.current.name, {...this.$state.params, tabId: tabId}, {notify: false, location: 'replace'});
    this.selectedTabId = tabId;
  }

  ngOnInit(): void {
    this.tabs = [
      new Tab(
        OidPollingPageTabIds.PRE_CONFIGURED,
        'Pre-Configured',
        new ComponentFactoryHelper(PreConfiguredOidPollingPageContainer, void 0, [])
      ),
      new Tab(
        OidPollingPageTabIds.CUSTOM,
        'Custom',
        new ComponentFactoryHelper(CustomOidPollingPageContainer, void 0, [])
      )
    ];
  }

}
