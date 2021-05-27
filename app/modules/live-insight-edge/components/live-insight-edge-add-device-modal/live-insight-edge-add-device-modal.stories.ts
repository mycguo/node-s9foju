import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeAddDeviceModalComponent } from './live-insight-edge-add-device-modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { LiveInsightEdgeModule } from '../../live-insight-edge.module';
import { LiveInsightEdgeDeviceListComponent } from '../live-insight-edge-device-list/live-insight-edge-device-list.component';
import { TextFilterComponent } from '../../../grid/components/filters/text-filter/text-filter.component';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeAddDeviceModalComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
      declarations: [LiveInsightEdgeDeviceListComponent],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeAddDeviceModalComponent,
});

Default.story = {
  name: 'default',
};
