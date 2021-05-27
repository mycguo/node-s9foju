import { moduleMetadata } from '@storybook/angular';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import GridData from '../../../grid/models/grid-data.model';
import { LiveInsightEdgeApplicationGroupListComponent } from './live-insight-edge-application-group-list.component';
import { AnalyticsPlatformMonitoredAppGroup } from '../../../../services/analytics-platform/monitored-app-group/analytics-platform-monitored-app-group';

export default {
  title: 'LiveInsightEdge/LiveInsightEdgeAppGroupListComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, GridModule],
      declarations: [LiveInsightEdgeApplicationGroupListComponent],
    }),
  ],
};

export const Default = () => ({
  props: {
    data: <GridData<AnalyticsPlatformMonitoredAppGroup>>{
      rows: [
        { id: '1', name: 'appGroup1', applications: 'app1, app2' },
        { id: '2', name: 'appGroup2', applications: 'app3, app4' },
        { id: '3', name: 'appGroup3', applications: 'app5, app6' },
      ],
    },
  },
  component: LiveInsightEdgeApplicationGroupListComponent,
  template: `
    <nx-live-insight-edge-application-group-list
        [data]="data"
    ></nx-live-insight-edge-application-group-list>
    `,
});

Default.story = {
  name: 'default',
};
