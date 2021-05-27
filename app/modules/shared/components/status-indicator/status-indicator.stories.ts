import { moduleMetadata } from '@storybook/angular';
import { StatusIndicatorComponent } from './status-indicator.component';
import { StatusIndicatorValues } from './enums/status-indicator-values.enum';

export default {
  title: 'Shared/Status Indicator',

  decorators: [
    moduleMetadata({
      declarations: [StatusIndicatorComponent],
    }),
  ],
};

export const ValidStatus = () => {
  return {
    template: `<span nx-status-indicator [status]=status class="my-class">Valid</span>`,
    props: {
      status: StatusIndicatorValues.VALID,
    },
  };
};

ValidStatus.story = {
  name: 'valid status',
};

export const InvalidStatus = () => {
  return {
    template: `<span nx-status-indicator [status]="status">Invalid</span>`,
    props: {
      status: StatusIndicatorValues.INVALID,
    },
  };
};

InvalidStatus.story = {
  name: 'invalid status',
};

export const UnknownStatus = () => {
  return {
    template: `<span nx-status-indicator [status]="status">Unknown</span>`,
    props: {
      status: StatusIndicatorValues.UNKNOWN,
    },
  };
};

UnknownStatus.story = {
  name: 'unknown status',
};

export const UnconfiguredStatus = () => {
  return {
    template: `<span nx-status-indicator [status]="status">Not configured</span>`,
    props: {
      status: StatusIndicatorValues.UNCONFIGURED,
    },
  };
};

UnconfiguredStatus.story = {
  name: 'unconfigured status',
};
