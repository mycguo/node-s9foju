import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Location} from '@angular/common';
import {EMPTY, Observable, Subscription} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {EntityState} from '@datorama/akita';

import {LiveInsightEdgePredictionsService} from '../../services/live-insight-edge-predictions/live-insight-edge-predictions.service';
import {LiveInsightEdgeReportChartObject} from '../../services/live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import {AnalyticsPlatformService} from '../../../../services/analytics-platform/analytics-platform.service';
import {TimeUtilsService} from '../../../../services/time-utils/time-utils.service';
import {UnconfiguredMessageService} from '../../services/unconfigured-message/unconfigured-message.service';
import {LiveInsightEdgeConnectionStatusModel} from '../../../../services/analytics-platform/connection/live-insight-edge-connection-status-model';
import {LiveInsightEdgeReportsFilterState} from '../downgrades/live-insight-edge-reports-downgrade-container/liveInsightEdgeReportsFilter.state';
import LiveInsightEdgePredictionsReportPageState from '../../services/live-insight-edge-predictions/live-insight-edge-predictions-report-page.state';
import LiveInsightEdgePredictionsReportParameters from '../../models/live-insight-edge-predictions-report-parameters';
import {LiveInsightEdgePredictionsReportPageService} from '../../services/live-insight-edge-predictions/live-insight-edge-predictions-report-page.service';
import {StatusIndicatorValues} from '../../../shared/components/status-indicator/enums/status-indicator-values.enum';
import {Logger} from '../../../logger/logger';

@UntilDestroy()
@Component({
  selector: 'nx-live-insight-edge-predictions-page-container',
  template: `
    <nx-loading
      [isLoading]="connectionCheckLoading$ | async"
      [error]="connectionError$ | async"
      [contentTemplate]="reports"
      [fatalMessageOverride]="connectionCustomError$ | async"
    >
      <ng-template #reports style="{height: 100%}">
        <nx-live-insight-edge-predictions-reports-list
          [reports]="reportService.selectReports() | async"
          [isLoading]="reportRequestLoading$ | async"
          [errorMessage]="reportRequestError$ | async"
        ></nx-live-insight-edge-predictions-reports-list>
      </ng-template>
    </nx-loading>
  `,
  providers: [LiveInsightEdgePredictionsService, LiveInsightEdgePredictionsReportPageService]
})
export class LiveInsightEdgePredictionsPageContainer implements OnInit, OnChanges, OnDestroy {

  NUMBER_OF_PREDICTIONS = 10; // Number of insights to show

  errorMessageModel: LaNoDataMessage;

  @Output() isLoading = new EventEmitter<boolean>();

  @Input() elementState: LiveInsightEdgeReportsFilterState;

  connectionCheckLoading$: Observable<boolean>;
  connectionError$: Observable<DetailedError>;
  connectionCustomError$: Observable<LaNoDataMessage>;
  reports$: Observable<EntityState<LiveInsightEdgeReportChartObject>>;
  pageState$: Observable<LiveInsightEdgePredictionsReportPageState>;
  reportRequestLoading$: Observable<boolean>;
  reportRequestError$: Observable<string>;
  pageStateSubscription: Subscription;

  constructor(
    public cd: ChangeDetectorRef,
    public reportService: LiveInsightEdgePredictionsService,
    public analyticsService: AnalyticsPlatformService,
    public liveInsightEdgePredictionsReportPageService: LiveInsightEdgePredictionsReportPageService,
    private location: Location,
    private timeUtils: TimeUtilsService,
    private unconfiguredMessageService: UnconfiguredMessageService,
    private logger: Logger,
  ) {
    this.errorMessageModel = this.unconfiguredMessageService.getNoDataMessage();
  }

  ngOnInit(): void {
    this.liveInsightEdgePredictionsReportPageService.checkConnection();
    this.liveInsightEdgePredictionsReportPageService.selectConnectionStatus()
      .pipe(untilDestroyed(this))
      .subscribe((connectionStatusModel: LiveInsightEdgeConnectionStatusModel) => {
        if (connectionStatusModel.status === StatusIndicatorValues.CONNECTED) {
          this.initializePage();
        }
      });

    this.connectionError$ = this.liveInsightEdgePredictionsReportPageService.selectConnectionError()
      .pipe(map<Error, DetailedError>(err => err != null ? Object.assign(err, {title: void 0}) : null));
    this.connectionCustomError$ = this.liveInsightEdgePredictionsReportPageService.selectConnectionCustomErrorMessage();
    this.reports$ = this.reportService.selectReports();
    this.reportRequestLoading$ = this.reportService.selectLoading();
    this.reportRequestError$ = this.reportService.selectError();
    this.pageState$ = this.liveInsightEdgePredictionsReportPageService.selectPageState();
    this.connectionCheckLoading$ = this.liveInsightEdgePredictionsReportPageService.selectLoading();
    this.reportRequestLoading$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(
        () => {
          // on each loading change explicitly run change detection.
          // this resolves issues with firefox and safari delays on cd
          setTimeout(() => {
            this.cd.detectChanges();
          });
        }
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.elementState != null && this.elementState != null) {
      this.stateInput(this.elementState);
    }
  }

  ngOnDestroy(): void {
    this.liveInsightEdgePredictionsReportPageService.resetPageState();
    this.reportService.resetStores();
    if (this.pageStateSubscription !== void 0) {
      this.pageStateSubscription.unsubscribe();
    }
  }

  stateInput(state: LiveInsightEdgeReportsFilterState): void {
    this.liveInsightEdgePredictionsReportPageService.setPageState({
      flexFilterString: state?.filter?.transformToFlexSearchString()
    });
  }

  private initializePage() {
    this.pageStateSubscription = this.liveInsightEdgePredictionsReportPageService.selectPageState()
      .pipe(
        untilDestroyed(this),
        map((pageState: LiveInsightEdgePredictionsReportPageState) => this.formatPageStateToParams(pageState)),
        switchMap((reportParams: LiveInsightEdgePredictionsReportParameters) =>
          this.reportService.getReports(reportParams)
            .pipe(
              // This error is reported upstream. This is to catch the exception thrown from
              // errors thrown from non-applicable filters.
              catchError(() => EMPTY)
            )
        ),
        catchError((err) => {
          this.logger.error(err);
          return EMPTY;
        })
      )
      .subscribe();

    this.reportService.selectLoading()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((isLoading: boolean) => {
        this.isLoading.emit(isLoading);
      });
  }

  /**
   * Create reports parameter request from page state
   * The query time is meant to be 13 months
   */
  private formatPageStateToParams(pageState: LiveInsightEdgePredictionsReportPageState): LiveInsightEdgePredictionsReportParameters {
    const currentDate = new Date();
    return {
      startTimeMillis: this.timeUtils.subMonths(currentDate, 13).getTime(),
      endTimeMillis: currentDate.getTime(),
      limit: this.NUMBER_OF_PREDICTIONS,
      flexFilter: pageState.flexFilterString
    };
  }

}
