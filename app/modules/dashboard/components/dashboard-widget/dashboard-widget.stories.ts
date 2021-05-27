import { moduleMetadata } from '@storybook/angular';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { WidgetVisualDirective } from '../../directives/widget-visual.directive';
import { DashboardWidgetTableComponent } from '../dashboard-widget-table/dashboard-widget-table.component';
import GridData from '../../../grid/models/grid-data.model';
import { DashboardWidgetTableConfig } from '../dashboard-widget-table/dashboard-widget-table-config';
import GridColumn from '../../../grid/models/grid-column.model';
import { GridModule } from '../../../grid/grid.module';
import { DashboardWidgetVisualComponent } from '../dashboard-widget-visual/dashboard-widget-visual.component';
import { WidgetVisualComponent } from '../../containers/dashboard-widget/widget-visual.component';
import { VisualDataGenerator } from '../../containers/dashboard-widget/visual-data-generator';
import GridBaseColumn from '../../../grid/models/grid-base-column';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

@Component({
  selector: 'nx-sample-widget-visual',
  template: `
    Test
    <p>{{ data | json }}</p>
  `,
})
export class SampleWidgetVisualComponent
  implements OnInit, WidgetVisualComponent<any, any> {
  @Input() data: any;
  @Input() config: any;

  dataGenerator: VisualDataGenerator;

  constructor() {}

  ngOnInit(): void {}
}

@UntilDestroy()
@Component({
  selector: 'nx-mock-async-widget-container',
  template: `
    <nx-dashboard-widget
      [component]="component"
      [data]="data$ | async"
    ></nx-dashboard-widget>
  `,
})
class MockAsyncWidgetContainer implements OnDestroy {
  data$: Observable<any>;
  component = SampleWidgetVisualComponent;
  subscription;

  constructor() {
    this.data$ = interval(1000).pipe(
      untilDestroyed(this),
      map((x) => [`data ${x}`])
    );
  }

  ngOnDestroy(): void {}
}

export default {
  title: 'Dashboard/DashboardWidgetComponent',

  decorators: [
    moduleMetadata({
      imports: [CommonModule, SharedModule, GridModule, LoggerTestingModule],
      declarations: [
        DashboardWidgetComponent,
        SampleWidgetVisualComponent,
        MockAsyncWidgetContainer,
        WidgetVisualDirective,
        DashboardWidgetVisualComponent,
        DashboardWidgetTableComponent,
      ],
      entryComponents: [
        DashboardWidgetTableComponent,
        SampleWidgetVisualComponent,
      ],
    }),
  ],

  excludeStories: ['SampleWidgetVisualComponent'],
};

export const Default = () => ({
  props: {
    component: SampleWidgetVisualComponent,
    data: ['test'],
  },
  template: `<nx-dashboard-widget
                    [component]="component"
                    [data]="data"
                    headerTitle="Header Title"
                    headerSubtitle="Subtitle"
                    dateRange="Last 30 days"
                ></nx-dashboard-widget>`,
});

Default.story = {
  name: 'default',
};

export const WithUpdates = () => ({
  requiresComponentDeclaration: false,
  template: `<nx-mock-async-widget-container></nx-mock-async-widget-container>`,
});

WithUpdates.story = {
  name: 'with updates',
};

export const ForTable = () => ({
  requiresComponentDeclaration: false,
  props: {
    component: DashboardWidgetTableComponent,
    data: new GridData([
      { col1: 'val 11', col2: 'val12' },
      { col1: 'val 21', col2: 'val22' },
      { col1: 'val 31', col2: 'val32' },
      { col1: 'val 41', col2: 'val42' },
      { col1: 'val 51', col2: 'val52' },
    ]),
    config: {
      columns: [
        new GridColumn({ name: 'Column 1', prop: 'col1' }),
        new GridColumn({ name: 'Column 2', prop: 'col2' }),
      ] as Array<GridBaseColumn>,
    } as DashboardWidgetTableConfig,
  },
  template: `
      <nx-dashboard-widget
        [data]="data"
        [config]="config"
        [component]="component"
        headerTitle="Header Title"
        headerSubtitle="Subtitle"
        dateRange="Last 30 days"
      ></nx-dashboard-widget>
    `,
});

ForTable.story = {
  name: 'for table',
};

export const UpdatingForTable = () => ({
  requiresComponentDeclaration: false,
  props: {
    component: DashboardWidgetTableComponent,
    data: new GridData([
      { col1: 'val 11', col2: 'val12' },
      { col1: 'val 21', col2: 'val22' },
      { col1: 'val 31', col2: 'val32' },
      { col1: 'val 41', col2: 'val42' },
      { col1: 'val 51', col2: 'val52' },
    ]),
    config: {
      columns: [
        new GridColumn({ name: 'Column 1', prop: 'col1' }),
        new GridColumn({ name: 'Column 2', prop: 'col2' }),
      ] as Array<GridBaseColumn>,
    } as DashboardWidgetTableConfig,
  },
  template: `
      <nx-dashboard-widget
        [isLoading]="true"
        [data]="data"
        [config]="config"
        [component]="component"
        [showContent]="true"
        headerTitle="Header Title"
        headerSubtitle="Subtitle"
        dateRange="Last 30 days"
      ></nx-dashboard-widget>
    `,
});

UpdatingForTable.story = {
  name: 'updating for table',
};
