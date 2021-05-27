import { ApplicationManagementTabIds } from '../../../enums/application-management-tab-ids.enum';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import SetElementState from '../../../../../containers/downgrades/SetElementState.interface';
import { BaseContainer } from '../../../../../containers/base-container/base.container';
import { UntilDestroy } from '@ngneat/until-destroy';

interface ApplicationManagementPageState {
  tabId: ApplicationManagementTabIds;
  error: Error;
}

@UntilDestroy()
@Component({
  selector: 'nx-application-management-page-downgrade-container',
  template: `
    <nx-application-management-page-container
      [selectedTab]="state.tabId"
      (tabSelected)="tabSelected.emit($event)"
    ></nx-application-management-page-container>
  `,
  styles: [`:host { display: block; height: 100%; }`]
})
export class ApplicationManagementPageDowngradeContainer
  extends BaseContainer<ApplicationManagementPageState>
  implements OnDestroy, SetElementState<ApplicationManagementPageState> {

  @Output() tabSelected = new EventEmitter<ApplicationManagementTabIds>();
  @Input() setElementState = (state: ApplicationManagementPageState) => this.stateInput(state);

  constructor(
    public cd: ChangeDetectorRef
  ) {
    super(cd);
    this.state = { tabId: void 0, error: void 0 };
  }

  stateInput(state: ApplicationManagementPageState): void {
    this.setState(state);
  }

  ngOnDestroy(): void {
  }
}
