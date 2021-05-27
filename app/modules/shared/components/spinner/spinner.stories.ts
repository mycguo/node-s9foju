import { SpinnerComponent } from './spinner.component';
import { SPINNER_SIZE } from './spinnerSize';
import { SPINNER_POSITION } from './spinnerPosition';

export default {
  title: 'Shared/Spinner',
};

export const Default = () => {
  return {
    template: `<nx-spinner></nx-spinner>`,
    moduleMetadata: {
      declarations: [SpinnerComponent],
    },
  };
};

Default.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-spinner></nx-spinner>

        `,
    },
  },
};

export const ExtraSmall = () => {
  return {
    template: `<nx-spinner spinnerSize="${SPINNER_SIZE.XS}"></nx-spinner>`,
    moduleMetadata: {
      declarations: [SpinnerComponent],
    },
  };
};

ExtraSmall.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-spinner spinnerSize="${SPINNER_SIZE.XS}"></nx-spinner>

        `,
    },
  },
};

export const Small = () => {
  return {
    template: `<nx-spinner spinnerSize="${SPINNER_SIZE.SM}"></nx-spinner>`,
    moduleMetadata: {
      declarations: [SpinnerComponent],
    },
  };
};

Small.story = {
  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-spinner spinnerSize="${SPINNER_SIZE.SM}"></nx-spinner>

        `,
    },
  },
};

export const CenteredOnAPage = () => {
  return {
    template: `<nx-spinner spinnerPosition="${SPINNER_POSITION.ABSOLUTE}"></nx-spinner>`,
    moduleMetadata: {
      declarations: [SpinnerComponent],
    },
  };
};

CenteredOnAPage.story = {
  name: 'Centered on a page',

  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-spinner spinnerPosition="${SPINNER_POSITION.ABSOLUTE}"></nx-spinner>

        `,
    },
  },
};

export const WithOverlay = () => {
  return {
    template: `<nx-spinner [spinnerOverlay]="true"></nx-spinner>`,
    moduleMetadata: {
      declarations: [SpinnerComponent],
    },
  };
};

WithOverlay.story = {
  name: 'With overlay',

  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-spinner [spinnerOverlay]="true"></nx-spinner>

        `,
    },
  },
};

export const FillContentAreaDisableContent = () => {
  return {
    template: `<nx-spinner [fillContentArea]="true"></nx-spinner>`,
    moduleMetadata: {
      declarations: [SpinnerComponent],
    },
  };
};

FillContentAreaDisableContent.story = {
  name: 'Fill Content Area (Disable Content)',

  parameters: {
    notes: {
      markdown: `
          HTML:

         <nx-spinner [fillContentArea]="true"></nx-spinner>

        `,
    },
  },
};
