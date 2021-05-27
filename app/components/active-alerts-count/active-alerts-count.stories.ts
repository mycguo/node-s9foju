import { moduleMetadata } from '@storybook/angular';
import AlertsSummary from '../../services/alerts/alertsSummary.model';
import { ActiveAlertsCountComponent } from './active-alerts-count.component';

export default {
  title: 'App/Active Alerts Count',
};

export const Default = () => {
  const alertSummary = Object.assign(new AlertsSummary(), {
    critical: 12,
    warning: 13,
    info: 45,
  });

  return {
    props: {
      alertsSummary: alertSummary,
    },
    template: `
        <div style="background: #354053">
          <nx-active-alerts-count
            [alertsSummary]="alertsSummary"
          ></nx-active-alerts-count>
        </div>
      `,
    moduleMetadata: {
      imports: [],
      declarations: [ActiveAlertsCountComponent],
    },
  };
};
