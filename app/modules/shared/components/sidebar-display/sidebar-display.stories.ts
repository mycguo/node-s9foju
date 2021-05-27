import { moduleMetadata } from '@storybook/angular';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../shared.module';
import { ComponentFactoryHelper } from '../../../../utils/component-factory-helper/component-factory-helper';

const defaultModeMarkdown = require('./notes/base.notes.md');
const customHeaderModeMarkdown = require('./notes/custom-header.notes.md');

@Component({
  selector: 'nx-sidebar-component',
  template: ` <div>Sidebar body</div> `,
})
export class SidebarDisplayStories {
  constructor() {}
}

@Component({
  selector: 'nx-sidebar-display-wrapper-host',
  template: `
    <nx-sidebar-display
      (close)="close()"
      titleText="Sidebar header"
      [componentHelper]="componentHelper"
      [footer]="footer"
      style="width: 320px;"
    >
      <ng-template #footer>Sidebar footer</ng-template>
    </nx-sidebar-display>
  `,
})
export class SidebarDisplayWrapperStories {
  @Output() closeSidebar = new EventEmitter();

  componentHelper = new ComponentFactoryHelper(SidebarDisplayStories);

  constructor() {}

  public close() {
    this.closeSidebar.emit();
  }
}

@Component({
  selector: 'nx-sidebar-display-custom-header-wrapper-host',
  template: `
    <nx-sidebar-display
      (close)="close()"
      [header]="header"
      [componentHelper]="componentHelper"
      style="width: 320px;"
    >
      <ng-template #header>Sidebar custom header</ng-template>
    </nx-sidebar-display>
  `,
})
export class SidebarContainerCustomHeaderWrapperStories {
  @Output() closeSidebar = new EventEmitter();
  componentHelper = new ComponentFactoryHelper(SidebarDisplayStories);

  constructor() {}

  public close() {
    this.closeSidebar.emit();
  }
}

@Component({
  template: `
    <mat-drawer-container hasBackdrop="false" style="height: 98vh;">
      <mat-drawer #drawer mode="over" position="end">
        <nx-sidebar-display-wrapper-host
          (closeSidebar)="closeSidebar()"
          *ngIf="!isCustomHeaderSidebarActive"
        >
        </nx-sidebar-display-wrapper-host>

        <nx-sidebar-display-custom-header-wrapper-host
          (closeSidebar)="closeSidebar()"
          *ngIf="isCustomHeaderSidebarActive"
        >
        </nx-sidebar-display-custom-header-wrapper-host>
      </mat-drawer>

      <mat-drawer-content>
        <div nxButtonList>
          <nx-button (btnClick)="openSidebar(false)">Open Sidebar</nx-button>
          <nx-button (btnClick)="openSidebar(true)"
            >Open Custom Header Sidebar</nx-button
          >
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class SidebarContainerPageStories {
  @ViewChild('drawer', { static: false }) sidebar: MatSidenav;

  public isCustomHeaderSidebarActive: boolean;

  constructor() {
    this.isCustomHeaderSidebarActive = false;
  }

  public openSidebar(isCustomHeaderSidebarActive: boolean) {
    this.isCustomHeaderSidebarActive = isCustomHeaderSidebarActive;
    this.sidebar.open().then(() => console.log(this.sidebar));
  }

  public closeSidebar() {
    this.sidebar.close().then(() => console.log(this.sidebar));
  }
}

export default {
  title: 'Shared/Sidebar Display',

  decorators: [
    moduleMetadata({
      imports: [MatSidenavModule, SharedModule],
      declarations: [
        SidebarDisplayWrapperStories,
        SidebarContainerCustomHeaderWrapperStories,
      ],
    }),
  ],

  excludeStories: [
    'SidebarDisplayStories',
    'SidebarDisplayWrapperStories',
    'SidebarContainerCustomHeaderWrapperStories',
    'SidebarContainerPageStories',
  ],
};

export const Base = () => ({
  component: SidebarContainerPageStories,
});

Base.story = {
  parameters: { notes: { markdown: defaultModeMarkdown } },
};

export const CustomHeader = () => ({
  component: SidebarContainerPageStories,
});

CustomHeader.story = {
  parameters: { notes: { markdown: customHeaderModeMarkdown } },
};
