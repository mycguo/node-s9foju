import { DeviceCurrentFlowsTabComponent } from './device-current-flows-tab.component';
import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

export default {
  title: 'Entity/DeviceCurrentFlowsTabComponent',
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ]
    })
  ]
};

export const Default = () => ({
  component: DeviceCurrentFlowsTabComponent,
});

Default.story = {
  name: 'default',
};
