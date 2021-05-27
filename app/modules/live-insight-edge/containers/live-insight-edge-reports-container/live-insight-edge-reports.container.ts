import {Component, forwardRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {LiveInsightEdgeReportChartObject} from '../../services/live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import {LiveInsightEdgeReportStateService} from '../../services/live-insight-edge-report-state/live-insight-edge-report-state.service';
import {Observable} from 'rxjs';
import ReportViewState from '../../services/live-insight-edge-report-state/report-view.state';
import {ReportHiddenSeries} from '../../services/live-insight-edge-report-state/report-hidden-series';

@Component({
  selector: 'nx-live-insight-edge-reports-container',
  template: `<nx-live-insight-edge-reports
                [report]="report"
                [reportKeyStatistics]="report?.metadata"
                [isLoading]="report?.isLoading"
                [errorMessage]="report?.error"
                [hiddenSeries]="(reportState$ | async)?.hiddenSeries"
                (seriesVisibilityChanged)="handleSeriesVisibilityChanged($event)"
             >
             </nx-live-insight-edge-reports>`,
  styles: [
    ':host {display: block; padding-bottom: 16px} :host:last-child {padding-bottom: 0}'
  ],
  providers: [
    LiveInsightEdgeReportStateService
  ],
})
export class LiveInsightEdgeReportsContainer implements OnInit, OnChanges {

  @Input() report: LiveInsightEdgeReportChartObject;

  reportState$: Observable<ReportViewState>;

  constructor(private reportStateService: LiveInsightEdgeReportStateService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.report != null) {
      if (!this.reportStateService.isStoreInitialized() &&
        this.report.id != null) {
        this.reportStateService.initializeStore(this.report.id.toString());
        this.reportState$ = this.reportStateService.selectReportState();
      }
    }
  }

  handleSeriesVisibilityChanged(hiddenSeries: ReportHiddenSeries) {
    this.reportStateService.updateSeriesVisibility(hiddenSeries);
  }

}
