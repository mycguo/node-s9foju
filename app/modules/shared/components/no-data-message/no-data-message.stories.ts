import { NoDataMessageComponent } from './no-data-message.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Shared/No Data Message',
};

export const WithIconAndAction = () => {
  return {
    template: `<nx-no-data-message [model]="model"></nx-no-data-message>`,
    props: {
      model: {
        icon: 'la-no-data-message__icon-no-data',
        title: 'You have not created any somethings yet.',
        buttons: [
          {
            text: 'Some Action',
            primary: true,
            action: () => {
              action('click')();
            },
          },
        ],
      },
    },
    moduleMetadata: {
      declarations: [NoDataMessageComponent],
    },
  };
};

WithIconAndAction.story = {
  name: 'With Icon and Action',

  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-no-data-message [model]="model"></nx-no-data-message>

         JS:

          model: {
            icon: 'la-no-data-message__icon-no-data',
            title: 'You have not created any somethings yet.',
            buttons: [{
              text: 'Some Action',
              primary: true,
              action: () => {
                action('click')();
              }
            }]
          }
        `,
    },
  },
};

export const WithIcon = () => {
  return {
    template: `<nx-no-data-message [model]="model"></nx-no-data-message>`,
    props: {
      model: {
        icon: 'la-no-data-message__icon-no-data',
        title: 'You have not created any somethings yet.',
      },
    },
    moduleMetadata: {
      declarations: [NoDataMessageComponent],
    },
  };
};

WithIcon.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-no-data-message [model]="model"></nx-no-data-message>

         JS:

          model: {
            icon: 'la-no-data-message__icon-no-data',
            title: 'You have not created any somethings yet.',
          }
        `,
    },
  },
};

export const JustMessage = () => {
  return {
    template: `<nx-no-data-message [model]="model"></nx-no-data-message>`,
    props: {
      model: {
        title: 'No data to display.',
      },
    },
    moduleMetadata: {
      declarations: [NoDataMessageComponent],
    },
  };
};

JustMessage.story = {
  name: 'Just message',

  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-no-data-message [model]="model"></nx-no-data-message>

         JS:

          model: {
              title: 'No data to display.',
          }
        `,
    },
  },
};
