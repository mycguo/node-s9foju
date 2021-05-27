import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeMonitoredDevicesComponent } from './live-insight-edge-monitored-devices.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { LiveInsightEdgeDeviceListComponent } from '../live-insight-edge-device-list/live-insight-edge-device-list.component';
import { TextFilterComponent } from '../../../grid/components/filters/text-filter/text-filter.component';
import { FormsModule } from '@angular/forms';
import GridData from '../../../grid/models/grid-data.model';
import { action } from '@storybook/addon-actions';
import { LiveInsightEdgeMonitoredDeviceCellRendererComponent } from '../live-insight-edge-monitored-device-cell-renderer/live-insight-edge-monitored-device-cell-renderer.component';
import FilterChange from '../../../grid/components/filters/filter-change';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeMonitoredDevicesComponent',

  decorators: [
    moduleMetadata({
      imports: [FormsModule, SharedModule, GridModule],
      declarations: [
        LiveInsightEdgeMonitoredDevicesComponent,
        LiveInsightEdgeDeviceListComponent,
        LiveInsightEdgeMonitoredDeviceCellRendererComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  props: {
    data: <GridData<any>>{
      rows: [
        {
          id: 'a',
          name: 'Device_1',
          node: { id: '1', label: 'Node_1' },
          site: { id: '1', label: 'Site_1' },
          region: { id: '1', label: 'Region 1' },
          tags: ['tag 1', 'tag 2'],
        },
        {
          id: 'b',
          name: 'Device_2',
          node: { id: '1', label: 'Node_1' },
          site: { id: '1', label: 'Site_1' },
          region: { id: '1', label: 'Region 1' },
          tags: ['tag 1', 'tag 2'],
        },
        {
          id: 'c',
          name: 'Device_3',
          node: { id: '1', label: 'Node_1' },
          site: { id: '1', label: 'Site_1' },
          region: { id: '1', label: 'Region 1' },
          tags: ['tag 1', 'tag 2'],
        },
        {
          id: 'd',
          name: 'Device_4',
          node: { id: '2', label: 'Node_2' },
          site: { id: '1', label: 'Site_1' },
          region: { id: '1', label: 'Region 1' },
          tags: ['tag 1', 'tag 2'],
        },
        {
          id: 'e',
          name: 'Device_5',
          node: { id: '2', label: 'Node_2' },
          site: { id: '1', label: 'Site_1' },
          region: { id: '1', label: 'Region 1' },
          tags: ['tag 1', 'tag 2'],
        },
        {
          id: 'f',
          name: 'Device_6',
          node: { id: '2', label: 'Node_2' },
          site: { id: '1', label: 'Site_1' },
          region: { id: '1', label: 'Region 1' },
          tags: ['tag 1', 'tag 2'],
        },
      ],
    },
    handleSearchChange: (term) => {
      action('Search Field')(term);
    },
    handleColumnFilterChange: (columnFiltersChange: Array<FilterChange>) => {
      action('Column Filter')(columnFiltersChange);
    },
  },
  component: LiveInsightEdgeMonitoredDevicesComponent,
  template: `
      <nx-live-insight-edge-monitored-devices
        [deviceList]="data"
        (searchTermChanged)="handleSearchChange($event)"
        (columnFilterChanged)="handleColumnFilterChange($event)"
      >
      </nx-live-insight-edge-monitored-devices>
    `,
});

Default.story = {
  name: 'default',
};
