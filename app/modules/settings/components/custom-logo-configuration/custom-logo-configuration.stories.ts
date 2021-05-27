import { moduleMetadata } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CustomLogoConfigurationComponent } from './custom-logo-configuration.component';

export default {
  title: 'Settings/CustomLogoConfiguration',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [CustomLogoConfigurationComponent],
    }),
  ],
};

export const Default = () => ({
  component: CustomLogoConfigurationComponent,
  props: {
    isLoading: false,
    error: void 0,
    logos: [],
    activeLogoId: void 0,
    logosConfig: {
      limit: 10,
      fileSize: 1048576,
      fileTypes: ['.jpg', '.jpeg', '.png'],
      ratio: {
        width: 8,
        height: 1,
      },
    },
  },
});

Default.story = {
  name: 'default',
};
