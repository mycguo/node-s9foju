import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationManagementTabIds } from '../../enums/application-management-tab-ids.enum';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'nx-application-management-page-container',
  template: `
    <nx-application-management-page
      [selectedTab]="selectedTab"
      (tabSelected)="onSelected($event)"
    ></nx-application-management-page>
  `,
  styles: [`:host { display: block; height: 100%; }`]
})
export class ApplicationManagementPageContainer implements OnInit, OnChanges, OnDestroy {
  @Input() selectedTab: ApplicationManagementTabIds;
  @Output() tabSelected = new EventEmitter<ApplicationManagementTabIds>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  onSelected(tabId: ApplicationManagementTabIds) {
    this.tabSelected.emit(tabId);
  }

}
