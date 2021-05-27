import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import IntegrationDisplayStateEnum from '../../enums/integration-display-state.enum';
import { LivencaIntegrationsContainer } from './livenca-integrations.container';

export default {
  title: 'Integrations/LiveNCAContainer',
  argTypes: {
    edit: {action: 'edit clicked'},
    delete: {action: 'delete clicked'},
    formSubmit: {action: 'form submitted'},
  },
  component: LivencaIntegrationsContainer,
  decorators: [
    moduleMetadata({
      imports: [
        SharedModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<LivencaIntegrationsContainer> = (args) =>
  ({
    component: LivencaIntegrationsContainer,
    props: args,
  });

export const Default = Template.bind({});
Default.args = {
  isLoading: false,
  displayState: IntegrationDisplayStateEnum.EDIT,
  data: {
    status: 'Valid',
    hostname: 'https://livenca.com',
  },
};
