import { moduleMetadata } from '@storybook/angular';
import { SeverityCellRendererComponent } from './severity-cell-renderer.component';
import { SeverityIndicatorComponent } from '../../../../shared/components/severity-indicator/severity-indicator.component';
import SeverityTypes from '../../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';

export default {
  title: 'Grid/Cell-Renders/SeverityCellRendererComponent',

  decorators: [
    moduleMetadata({
      declarations: [SeverityIndicatorComponent],
    }),
  ],
};

export const Critical = () => ({
  component: SeverityCellRendererComponent,
  props: { value: SeverityTypes.CRITICAL },
});

export const Warning = () => ({
  component: SeverityCellRendererComponent,
  props: { value: SeverityTypes.WARNING },
});

export const Info = () => ({
  component: SeverityCellRendererComponent,
  props: { value: SeverityTypes.INFO },
});

export const Multiple = () => ({
  component: SeverityCellRendererComponent,
  props: { value: SeverityTypes.MULTIPLE },
});
