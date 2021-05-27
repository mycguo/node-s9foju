import { moduleMetadata } from '@storybook/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../shared.module';
import { action } from '@storybook/addon-actions';
import { Tab } from './tab';
import { ComponentFactoryHelper } from '../../../../utils/component-factory-helper/component-factory-helper';

const baseMarkdown = require('./notes/base.notes.md');
const selectedItemMarkdown = require('./notes/selected-item.notes.md');
const disabledItemMarkdown = require('./notes/disabled-item.notes.md');
const customLabelMarkdown = require('./notes/custom-label.notes.md');

@Component({
  selector: 'nx-tabset-first-tab-content-host',
  template: `First Option: {{ firstOptionA }}&nbsp;Second Option:
    {{ secondOptionA }} <br />
    <button (click)="btnClick.emit('button clicked')">Click me</button>`,
})
  // @ts-ignore
class TabsFirstTabContentHostComponent {
  // @ts-ignore
  @Input() firstOptionA: string;
  // @ts-ignore
  @Input() secondOptionA: number;

  // @ts-ignore
  @Output() btnClick = new EventEmitter<string>();
}

@Component({
  selector: 'nx-tabset-second-tab-content-host',
  template: `First Option: {{ firstOptionB }}&nbsp;Second Option:
    {{ secondOptionB }}`,
})
  // @ts-ignore
class TabsSecondTabContentHostComponent {
  // @ts-ignore
  @Input() firstOptionB: string;
  // @ts-ignore
  @Input() secondOptionB: number;
}

@Component({
  selector: 'nx-tabset-third-tab-content-host',
  template: `First Option: {{ firstOptionC }}&nbsp;Second Option:
    {{ secondOptionC }}`,
})
  // @ts-ignore
class TabsThirdTabContentHostComponent {
  // @ts-ignore
  @Input() firstOptionC: string;
  // @ts-ignore
  @Input() secondOptionC: number;
}

const getTabsGroup = (): Tab[] => {
  const tab1 = new Tab(
    'Tab1',
    'Tab 1',
    new ComponentFactoryHelper(
      TabsFirstTabContentHostComponent,
      {
        firstOptionA: '-Content-',
        secondOptionA: 1,
      },
      ['btnClick']
    )
  );
  tab1.componentHelper
    .getOutput('btnClick')
    .subscribe((val) => action('Output-test')(val));

  const tab2 = new Tab(
    'Tab2',
    'Tab 2',
    new ComponentFactoryHelper(TabsSecondTabContentHostComponent, {
      firstOptionB: '-Content-',
      secondOptionB: 2,
    })
  );

  const tab3 = new Tab(
    'Tab3',
    'Tab 3',
    new ComponentFactoryHelper(TabsThirdTabContentHostComponent, {
      firstOptionC: '-Content-',
      secondOptionC: 3,
    })
  );
  return [tab1, tab2, tab3];
};

const hostStyles = {
  '[style.display]': '"block"',
  '[style.borderTop]': '"1px solid #E8ECF1"',
};

@Component({
  selector: 'nx-tabset-base-host',
  template: ` <nx-tabset
    [tabGroup]="tabGroup"
    (tabSelected)="selectedTabChange($event)"
  ></nx-tabset>`,
  host: hostStyles,
})
  // @ts-ignore
class TabsBaseHostComponent {
  tabGroup: Tab[] = getTabsGroup();

  selectedTabChange(activeTabId): void {
    action('tab-change')(activeTabId);
  }
}

@Component({
  selector: 'nx-tabset-selected-item-host',
  template: ` <nx-tabset
    [tabGroup]="tabGroup"
    [selectedTabId]="selectedTabId"
    (tabSelected)="selectedTabChange($event)"
  ></nx-tabset>`,
  host: hostStyles,
})
  // @ts-ignore
class TabsSelectedItemHostComponent {
  tabGroup: Tab[] = getTabsGroup();
  selectedTabId;

  constructor() {
    this.selectedTabId = this.tabGroup[1].id;
  }

  selectedTabChange(activeTabId): void {
    action('tab-change')(activeTabId);
  }
}

@Component({
  selector: 'nx-tabset-disabled-host',
  template: ` <nx-tabset
    [tabGroup]="tabGroup"
    (tabSelected)="selectedTabChange($event)"
  ></nx-tabset>`,
  host: hostStyles,
})
  // @ts-ignore
class TabsDisabledHostComponent {
  tabGroup: Tab[] = getTabsGroup();

  constructor() {
    this.tabGroup[1].disabled = true;
  }

  selectedTabChange(activeTabId): void {
    action('tab-change')(activeTabId);
  }
}

@Component({
  selector: 'nx-tabset-custom-label-host',
  template: `
    <nx-tabset
      [tabGroup]="tabGroup"
      (tabSelected)="selectedTabChange($event)"
    ></nx-tabset>
    <ng-template #tab2Label
      ><span>2&nbsp;<i>(custom)</i></span></ng-template
    >
  `,
  host: hostStyles,
})
  // @ts-ignore
class TabsCustomLabelHostComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild('tab2Label') tab2LabelContent: TemplateRef<any>;
  tabGroup: Tab[] = getTabsGroup();

  ngAfterViewInit(): void {
    this.tabGroup[1].labelTemplateRef = this.tab2LabelContent;
  }

  selectedTabChange(activeTabId): void {
    action('tab-change')(activeTabId);
  }
}

export default {
  title: 'shared/TabsComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, MatTabsModule, BrowserAnimationsModule],
      declarations: [
        TabsFirstTabContentHostComponent,
        TabsSecondTabContentHostComponent,
        TabsThirdTabContentHostComponent,
      ],
      entryComponents: [
        TabsFirstTabContentHostComponent,
        TabsSecondTabContentHostComponent,
        TabsThirdTabContentHostComponent,
      ],
    }),
  ],
};

export const Base = () => ({
  component: TabsBaseHostComponent,
});

Base.story = {
  parameters: { notes: { markdown: baseMarkdown } },
};

export const SelectedItem = () => ({
  component: TabsSelectedItemHostComponent,
});

SelectedItem.story = {
  parameters: { notes: { markdown: selectedItemMarkdown } },
};

export const DisabledItem = () => ({
  component: TabsDisabledHostComponent,
});

DisabledItem.story = {
  parameters: { notes: { markdown: disabledItemMarkdown } },
};

export const CustomLabel = () => ({
  component: TabsCustomLabelHostComponent,
});

CustomLabel.story = {
  parameters: { notes: { markdown: customLabelMarkdown } },
};
