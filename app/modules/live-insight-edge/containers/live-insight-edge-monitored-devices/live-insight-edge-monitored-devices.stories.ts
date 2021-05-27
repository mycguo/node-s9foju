import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeMonitoredDevicesContainer } from './live-insight-edge-monitored-devices.container';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LiveInsightEdgeMonitoredDevicesComponent } from '../../components/live-insight-edge-monitored-devices/live-insight-edge-monitored-devices.component';
import { LiveInsightEdgeDeviceListComponent } from '../../components/live-insight-edge-device-list/live-insight-edge-device-list.component';
import { GridModule } from '../../../grid/grid.module';
import { LiveInsightEdgeMonitoredDeviceCellRendererComponent } from '../../components/live-insight-edge-monitored-device-cell-renderer/live-insight-edge-monitored-device-cell-renderer.component';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeMonitoredDevicesContainer',

  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        GridModule,
      ],
      declarations: [
        LiveInsightEdgeMonitoredDevicesContainer,
        LiveInsightEdgeMonitoredDevicesComponent,
        LiveInsightEdgeDeviceListComponent,
        LiveInsightEdgeMonitoredDeviceCellRendererComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeMonitoredDevicesContainer,
});

Default.story = {
  name: 'default',
};
