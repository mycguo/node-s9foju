import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeSummaryComponent } from './live-insight-edge-summary.component';
import { SharedModule } from '../../../shared/shared.module';
import { DashboardModule } from '../../../dashboard/dashboard.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeSummaryComponent',

  decorators: [
    moduleMetadata({
      imports: [DashboardModule, LoggerTestingModule, SharedModule],
      declarations: [LiveInsightEdgeSummaryComponent],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeSummaryComponent,
  props: {
    isLiveNaConnectionChecked: true,
  },
});

Default.story = {
  name: 'default',
};
