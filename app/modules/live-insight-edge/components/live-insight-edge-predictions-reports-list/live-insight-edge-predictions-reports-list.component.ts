import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LiveInsightEdgeReportChartObject} from '../../services/live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  selector: 'nx-live-insight-edge-predictions-reports-list',
  templateUrl: './live-insight-edge-predictions-reports-list.component.html',
  styleUrls: ['./live-insight-edge-predictions-reports-list.component.less']
})
export class LiveInsightEdgePredictionsReportsListComponent implements OnChanges {

  @Input() reports: Array<LiveInsightEdgeReportChartObject>;
  @Input() isLoading = true;
  @Input() errorMessage: string;

  noDataObj = new LaNoDataMessage('No data available at the moment',
    'Please wait for data to become available...',
    'la-no-data-message__icon-no-data');

  errorMessageObj: DetailedError;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.errorMessage?.currentValue !== changes.errorMessage?.previousValue) {
      if (this.errorMessage != null) {
        this.errorMessageObj = new DetailedError(void 0, this.errorMessage);
      }
    }
  }

}
