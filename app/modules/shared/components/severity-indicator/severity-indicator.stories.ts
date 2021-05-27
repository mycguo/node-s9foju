import { moduleMetadata } from '@storybook/angular';
import { SeverityIndicatorComponent } from './severity-indicator.component';
import SeverityTypes from '../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
const markdown = require('./notes/severity-indicator.note.md');

export default {
  title: 'Shared/Severity Indicator',

  decorators: [
    moduleMetadata({
      declarations: [SeverityIndicatorComponent],
    }),
  ],
};

export const Critical = () => {
  return {
    template: `<nx-severity-indicator [severity]=severity>Valid</nx-severity-indicator>`,
    props: {
      severity: SeverityTypes.CRITICAL,
    },
  };
};

Critical.story = {
  parameters: { notes: { markdown: markdown } },
};

export const Warning = () => {
  return {
    template: `<nx-severity-indicator [severity]="severity">Invalid</nx-severity-indicator>`,
    props: {
      severity: SeverityTypes.WARNING,
    },
  };
};

Warning.story = {
  parameters: { notes: { markdown: markdown } },
};

export const Info = () => {
  return {
    template: `<nx-severity-indicator [severity]="severity">Invalid</nx-severity-indicator>`,
    props: {
      severity: SeverityTypes.INFO,
    },
  };
};

Info.story = {
  parameters: { notes: { markdown: markdown } },
};
