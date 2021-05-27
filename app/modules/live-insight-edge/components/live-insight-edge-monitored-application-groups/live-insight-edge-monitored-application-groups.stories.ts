import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { FormsModule } from '@angular/forms';
import GridData from '../../../grid/models/grid-data.model';
import { action } from '@storybook/addon-actions';
import FilterChange from '../../../grid/components/filters/filter-change';
import { LiveInsightEdgeMonitoredApplicationGroupsComponent } from './live-insight-edge-monitored-application-groups.component';
import { LiveInsightEdgeApplicationGroupListComponent } from '../live-insight-edge-application-group-list/live-insight-edge-application-group-list.component';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeMonitoredAppGroupsComponent',

  decorators: [
    moduleMetadata({
      imports: [FormsModule, SharedModule, GridModule],
      declarations: [
        LiveInsightEdgeMonitoredApplicationGroupsComponent,
        LiveInsightEdgeApplicationGroupListComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  props: {
    data: <GridData<any>>{
      rows: [
        { id: 'a', name: 'Device_1', applications: 'app 1' },
        { id: 'b', name: 'Device_2', applications: 'app 2' },
        { id: 'c', name: 'Device_3', applications: 'app 3' },
        { id: 'd', name: 'Device_4', applications: 'app 4' },
      ],
    },
    handleSearchChange: (term) => {
      action('Search Field')(term);
    },
    handleColumnFilterChange: (columnFiltersChange: Array<FilterChange>) => {
      action('Column Filter')(columnFiltersChange);
    },
  },
  component: LiveInsightEdgeMonitoredApplicationGroupsComponent,
  template: `
      <nx-live-insight-edge-monitored-application-groups
        [appGroupList]="data"
        [isLoading]="false"
        (searchTermChanged)="handleSearchChange($event)"
        (columnFilterChanged)="handleColumnFilterChange($event)"
      >
      </nx-live-insight-edge-monitored-application-groups>
    `,
});

Default.story = {
  name: 'default',
};
