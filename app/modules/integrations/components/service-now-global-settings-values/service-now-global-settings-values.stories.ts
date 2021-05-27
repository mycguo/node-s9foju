import { moduleMetadata } from '@storybook/angular';
import { ServiceNowGlobalSettingsValuesComponent } from './service-now-global-settings-values.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

export default {
  title: 'Integrations/ServiceNowGlobalSettingsValuesComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [ServiceNowGlobalSettingsValuesComponent],
    }),
  ],
};

export const Default = () => ({
  component: ServiceNowGlobalSettingsValuesComponent,
});

Default.story = {
  name: 'default',
};
