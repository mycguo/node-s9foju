import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LivencaFormComponent } from '../livenca-form/livenca-form.component';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import { BasicIntegrationFormComponent } from '../basic-integration-form/basic-integration-form.component';
import { LivencaIntegrationsComponent } from './livenca-integrations.component';

export default {
  title: 'Integrations/LiveNCA',
  argTypes: {
    edit: {action: 'edit clicked'},
    delete: {action: 'delete clicked'},
    formSubmit: {action: 'form submitted'},
  },
  component: LivencaIntegrationsComponent,
  subcomponents: LivencaFormComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        SharedModule,
      ],
      declarations: [
        LivencaFormComponent,
        BasicIntegrationFormComponent
      ],
    }),
  ]
} as Meta;

const Template: Story<LivencaIntegrationsComponent> = (args) =>
  ({
    component: LivencaIntegrationsComponent,
    props: args,
  });

export const Configure = Template.bind({});
Configure.args = {
  isLoading: false,
  displayState: IntegrationDisplayStateEnum.EDIT,
  data: {
    status: 'Valid',
  },
};

export const Configured = Template.bind({});
Configured.args = {
  isLoading: false,
  displayState: IntegrationDisplayStateEnum.VIEW,
  data: {
    status: 'Valid',
    hostname: 'https://livenca.com',
  },
};
