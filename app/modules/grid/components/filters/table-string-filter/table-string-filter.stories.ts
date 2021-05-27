import { moduleMetadata } from '@storybook/angular';
import { TableStringFilterComponent } from './table-string-filter.component';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GridDataSource } from '../../../models/grid-data-source';
import { AnalyticsPlatformService } from '../../../../../services/analytics-platform/analytics-platform.service';
import {
  Grid_String_Filter,
  gridStringFilter,
} from '../../../services/grid-string-filter/grid-string-filter.factory';
import { ValueStringFilterService } from '../../../../../utils/dataUtils/value-string-filter.service';
import { GridFilterable } from '../../../services/grid-string-filter/grid-filterable';
import { SharedModule } from '../../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { action } from '@storybook/addon-actions';
import {LoggerTestingModule} from '../../../../logger/logger-testing/logger-testing.module';

@Component({
  selector: 'nx-table-string-filter-container',
  template: `
    <nx-table-string-filter
      [searchTerm]="searchTerm"
      (searchTermChange)="handleSearchTermChange($event)"
    ></nx-table-string-filter>
  `,
  viewProviders: [
    { provide: GridDataSource, useExisting: AnalyticsPlatformService },
    {
      provide: Grid_String_Filter,
      useFactory: gridStringFilter((entity) => ({})),
      deps: [GridDataSource, ValueStringFilterService],
    },
  ],
})
export class MockTableStringFilterContainer implements OnInit, OnDestroy {
  @Input() gridDataService: GridFilterable<any, any>;

  searchTerm: string;

  constructor() {}

  ngOnInit() {}

  handleSearchTermChange(changed: string) {
    this.searchTerm = changed;
    action('search')(`changed to ${changed}`);
  }

  ngOnDestroy(): void {}
}

export default {
  title: 'Grid/TableStringFilterComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, HttpClientTestingModule, LoggerTestingModule],
      declarations: [
        TableStringFilterComponent,
        MockTableStringFilterContainer,
      ],
    }),
  ],

  excludeStories: ['MockTableStringFilterContainer'],
};

export const Default = () => ({
  component: MockTableStringFilterContainer,
});

Default.story = {
  name: 'default',
};
