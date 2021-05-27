import { action, configureActions } from '@storybook/addon-actions';
import { CustomTextToggleComponent } from './custom-text-toggle.component';

export default {
  title: 'Shared/Custom Text Toggle',
};

export const Default = () => {
  let toggleState = false;
  return {
    props: {
      handleValueChanged: (updatedOption) => {
        action('value changed')(updatedOption);
        toggleState = updatedOption;
      },
      toggleState,
    },
    template: `
          <nx-custom-text-toggle
            option1="Option 1"
            option2="Option 2"
            toggleLabel="Toggle Label"
            [isOption1]="toggleState"
            (valueChanged)="handleValueChanged($event)"
          ></nx-custom-text-toggle>`,
    moduleMetadata: {
      imports: [],
      declarations: [CustomTextToggleComponent],
    },
  };
};
