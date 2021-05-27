import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeReportsListComponent } from './live-insight-edge-reports-list.component';
import { LiveInsightEdgeReportsComponent } from '../live-insight-edge-reports/live-insight-edge-reports.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import SortOrder from '../../services/live-insight-edge-report-page/sort-order';
import { SPINNER_SIZE } from '../../../shared/components/spinner/spinnerSize';
import { SPINNER_POSITION } from '../../../shared/components/spinner/spinnerPosition';
import { LaNoDataMessage } from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';

export default {
  title:
    'LiveInsightEdge/LiveInsight Edge Reports/LiveInsightEdgeReportsListComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [
        LiveInsightEdgeReportsListComponent,
        LiveInsightEdgeReportsComponent,
      ],
    }),
  ],
};

export const Loading = () => ({
  props: {
    dateSort: SortOrder.DESCENDING,
    anomalyCountSort: SortOrder.DESCENDING,
    isLoading: true,
  },
  component: LiveInsightEdgeReportsListComponent,
});

Loading.story = {
  name: 'loading',
};

export const Error = () => ({
  props: {
    dateSort: SortOrder.DESCENDING,
    anomalyCountSort: SortOrder.DESCENDING,
    isLoading: false,
    errorMessage: new LaNoDataMessage('This is an error message'),
  },
  component: LiveInsightEdgeReportsListComponent,
});

Error.story = {
  name: 'error',
};
