import { moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { UpdatingDataMessageComponent } from './updating-data-message.component';
import { SharedModule } from '../../shared.module';

export default {
  title: 'Shared/Updating Data Message',

  decorators: [
    moduleMetadata({
      imports: [SharedModule],
    }),
  ],
};

export const Default = () => ({
  component: UpdatingDataMessageComponent,
  props: {
    message: 'Update is in progress. Please wait.',
  },
});

export const CancelAction = () => ({
  component: UpdatingDataMessageComponent,
  props: {
    message: 'Update is in progress. Please wait.',
    cancel: () => action('Cancel clicked')(),
  },
});

CancelAction.story = {
  name: 'Cancel action',
};

export const CustomCancelTitle = () => ({
  component: UpdatingDataMessageComponent,
  props: {
    message: 'Update is in progress. Please wait.',
    cancelTitle: 'Cancel update',
    cancel: () => action('Cancel clicked')(),
  },
});

CustomCancelTitle.story = {
  name: 'Custom cancel title',
};
