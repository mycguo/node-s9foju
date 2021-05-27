import { moduleMetadata } from '@storybook/angular';
import { DashboardWidgetVisualComponent } from './dashboard-widget-visual.component';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

export default {
  title: 'Dashboard/DashboardWidgetVisualComponent',

  decorators: [
    moduleMetadata({
      imports: [LoggerTestingModule]
    }),
  ],
};

export const Default = () => ({
  component: DashboardWidgetVisualComponent,
});

Default.story = {
  name: 'default',
};
