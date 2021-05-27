import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
 OnDestroy, OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {SeriesLegend} from '../../../shared/components/charts/horizontal-legend/series-legend';
import {LiveInsightEdgeReportChartObject} from '../../services/live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay} from 'rxjs/operators';
import {ReportMetaData} from '../../../reporting/models/charts/metadata/report-meta-data';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {SkeletonScreenTypes} from '../../../shared/components/skeleton-screen/enums/skeleton-screen-types.enum';
import {LiveInsightEdgeReportsPresenterService} from './live-insight-edge-reports-presenter.service';
import {ReportHiddenSeries} from '../../services/live-insight-edge-report-state/report-hidden-series';
import {liveInsightEdgePresenterToken} from './live-insight-edge-reports-presenter.token';
import DetailedError from '../../../shared/components/loading/detailed-error';

@Component({
  selector: 'nx-live-insight-edge-reports',
  templateUrl: './live-insight-edge-reports.component.html',
  styleUrls: [
    './live-insight-edge-reports.component.less'
  ],
  viewProviders: [
    {
      provide: liveInsightEdgePresenterToken,
      useFactory: () => new LiveInsightEdgeReportsPresenterService()
    }
  ]
})
export class LiveInsightEdgeReportsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() report: LiveInsightEdgeReportChartObject;
  @Input() reportKeyStatistics: Array<ReportMetaData>;

  @Input() isLoading: boolean;
  @Input() errorMessage: string;
  @Input() hiddenSeries: ReportHiddenSeries;

  @Output() seriesVisibilityChanged = new EventEmitter<ReportHiddenSeries>();

  seriesLegendSubject = new BehaviorSubject<Array<SeriesLegend>>([]);
  seriesLegends$: Observable<Array<SeriesLegend>>;

  errorMessageObj: LaNoDataMessage;
  detailedError: DetailedError;
  skeletonLoadingScreenType = SkeletonScreenTypes.CHART;

  constructor(
    @Inject(liveInsightEdgePresenterToken)
    private liveInsightEdgeReportsPresenter: LiveInsightEdgeReportsPresenterService) { }

  ngOnInit(): void {
    this.seriesLegends$ = this.seriesLegendSubject.pipe(
      // note that the chart rendering event is getting propagated outside the
      // angular lifecyle
      delay(0)
    );
  }

  handleChartRender(event: Event) {
    // pull out the colors from the series to use for the legend
    const chartFromEvent = <Highcharts.Chart><unknown>event.target;
    const updatedSeriesLegends = this.liveInsightEdgeReportsPresenter
      .buildSeriesLegendForChart(chartFromEvent, this.hiddenSeries);
    this.seriesLegendSubject.next(updatedSeriesLegends);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading?.currentValue !== changes.isLoading?.previousValue) {
      if (!this.isLoading && this.errorMessage == null && this.report.chart == null) {
        this.errorMessageObj = new LaNoDataMessage('No Data', null,
          'la-no-data-message__icon-no-data');
        this.detailedError = new DetailedError('', '');
      }
    }
    if (changes.errorMessage?.currentValue !== changes.errorMessage?.previousValue) {
      if (this.errorMessage != null) {
        this.errorMessageObj = new LaNoDataMessage(this.errorMessage, null,
          'la-no-data-message__icon-no-data');
        this.detailedError = new DetailedError('', '');
      } else {
        this.detailedError = null;
      }
    }
    if (changes.hiddenSeries != null) {
      // propagate to legend
      const currentLegend = this.seriesLegendSubject.getValue();
      const updatedLegend = this.liveInsightEdgeReportsPresenter
        .buildUpdatedSeriesLegend(this.hiddenSeries, currentLegend);
      this.seriesLegendSubject.next(updatedLegend);
    }
  }

  handleSeriesClick(seriesLegend: SeriesLegend) {
    const updatedHiddenSeries = this.liveInsightEdgeReportsPresenter
      .buildHiddenSeriesObject(seriesLegend, this.hiddenSeries);
    this.seriesVisibilityChanged.emit(updatedHiddenSeries);
  }

  ngOnDestroy() {
    this.seriesLegendSubject.complete();
  }

}
