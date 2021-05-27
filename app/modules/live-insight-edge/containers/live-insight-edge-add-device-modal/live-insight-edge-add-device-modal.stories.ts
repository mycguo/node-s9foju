import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeAddDeviceModalContainer } from './live-insight-edge-add-device-modal.container';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GridModule } from '../../../grid/grid.module';
import { LiveInsightEdgeMonitoredDevicesContainer } from '../live-insight-edge-monitored-devices/live-insight-edge-monitored-devices.container';
import { LiveInsightEdgeMonitoredDevicesComponent } from '../../components/live-insight-edge-monitored-devices/live-insight-edge-monitored-devices.component';
import { LiveInsightEdgeDeviceListComponent } from '../../components/live-insight-edge-device-list/live-insight-edge-device-list.component';
import { LiveInsightEdgeMonitoredDeviceCellRendererComponent } from '../../components/live-insight-edge-monitored-device-cell-renderer/live-insight-edge-monitored-device-cell-renderer.component';
import { LiveInsightEdgeAddDeviceModalComponent } from '../../components/live-insight-edge-add-device-modal/live-insight-edge-add-device-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeAddDeviceModalContainer',

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
        LiveInsightEdgeAddDeviceModalComponent,
        LiveInsightEdgeAddDeviceModalContainer,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeAddDeviceModalContainer,
});

Default.story = {
  name: 'default',
};
