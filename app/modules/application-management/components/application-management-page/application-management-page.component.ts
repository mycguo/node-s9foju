import {ApplicationGroupsContainer} from '../../containers/application-groups/application-groups.container';
import {ComponentFactoryHelper} from '../../../../utils/component-factory-helper/component-factory-helper';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ApplicationManagementTabIds} from '../../enums/application-management-tab-ids.enum';
import {Tab} from '../../../shared/components/tabset/tab';
import {Router} from '@angular/router';
import {CustomApplicationsContainer} from '../../containers/custom-applications/custom-applications.container';

@Component({
  selector: 'nx-application-management-page',
  templateUrl: './application-management-page.component.html',
  styleUrls: ['./application-management-page.component.less']
})
export class ApplicationManagementPageComponent implements OnInit, OnChanges {
  @Input() selectedTab: ApplicationManagementTabIds;
  @Output() tabSelected = new EventEmitter<ApplicationManagementTabIds>();
  selectedTabId: string;
  tabs: Array<Tab>;

  constructor( private router: Router ) { }

  ngOnInit(): void {
    this.tabs = [
      new Tab(
        ApplicationManagementTabIds.CUSTOM_APPLICATIONS,
        'Custom Applications',
        new ComponentFactoryHelper(CustomApplicationsContainer, void 0, [])
      ),
      new Tab(
        ApplicationManagementTabIds.APPLICATION_GROUPS,
        'Application Groups',
        new ComponentFactoryHelper(ApplicationGroupsContainer, void 0, [])
      )
    ];
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedTab?.currentValue !== void 0) {
      this.selectedTabId = this.selectedTab;
    }
  }

  handleTabSelected(tabId: string): void {
    let value: ApplicationManagementTabIds;
    switch (tabId) {
      case ApplicationManagementTabIds.APPLICATION_GROUPS:
        value = ApplicationManagementTabIds.APPLICATION_GROUPS;
        break;
      case ApplicationManagementTabIds.CUSTOM_APPLICATIONS:
        value = ApplicationManagementTabIds.CUSTOM_APPLICATIONS;
        break;
      default:
        // return undefined
    }
    this.tabSelected.emit(value);
  }

  navigateToApplicationsPage(): void {
    this.router.navigateByUrl('/applications');
  }
}
