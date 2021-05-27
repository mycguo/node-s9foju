import { moduleMetadata } from '@storybook/angular';
import { LiveInsightEdgeReportsComponent } from './live-insight-edge-reports.component';
import { Component } from '@angular/core';
import { LabeledCardComponent } from '../../../shared/components/labeled-card/labeled-card.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TimeSeriesChartComponent } from '../../../shared/components/charts/time-series-chart/time-series-chart.component';
import { ChartWidgetComponent } from '../../../shared/components/chart-widget/chart-widget.component';
import { KeyValueListItemDirective } from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';
import { KeyValueListComponent } from '../../../shared/components/key-value-list/key-value-list.component';
import ReportTimeSeriesChartData from '../../../reporting/models/charts/time-series/report-time-series-chart-data.model';
import ReportTimeSeries from '../../../reporting/models/charts/time-series/report-time-series.model';
import ReportTimeSeriesConfiguration from '../../../reporting/models/charts/time-series/report-time-series-configuration';
import ReportLineStyle from '../../../reporting/models/charts/time-series/report-line-style';
import ReportTimeSeriesDataPoint from '../../../reporting/models/charts/time-series/report-time-series-data-point';
import LiveInsightPointMetaData from '../../../reporting/models/charts/points/live-insight-point-meta-data';
import { HorizontalLegendComponent } from '../../../shared/components/charts/horizontal-legend/horizontal-legend.component';
import { LiveInsightEdgeReportChartObject } from '../../services/live-insight-edge-report-page/reports-services/live-insight-edge-report-chart-object';
import InsightChartHeaderInfo from '../../../reporting/models/charts/headers/insight-chart-header-info';
import ReportDirectionParameter from '../../../reporting/models/api/parameter-enums/report-direction-parameter';
import { ReportMetaData } from '../../../reporting/models/charts/metadata/report-meta-data';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NoDataMessageComponent } from '../../../shared/components/no-data-message/no-data-message.component';
import { SimpleAlertComponent } from '../../../shared/components/simple-alert/simple-alert.component';
import { SkeletonScreenComponent } from '../../../shared/components/skeleton-screen/skeleton-screen.component';
import { ReportTimeSeriesType } from '../../../reporting/models/charts/time-series/report-time-series-type';
import { ReportPointStyle } from '../../../reporting/models/charts/time-series/report-point-style.enum';
import { ChartElementColors } from '../../../shared/components/chart-widget/constants/chart-element-colors.enum';
import ReportAxisModel from '../../../reporting/models/charts/report-axis.model';
import { format } from 'date-fns';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'nx-live-insight-edge-reports-mock-container',
  template: `
    <ng-container *ngFor="let report of reports">
      <nx-live-insight-edge-reports
        [report]="report"
        [reportKeyStatistics]="keyStatistics"
      >
      </nx-live-insight-edge-reports>
    </ng-container>
  `,
})
// @ts-ignore
class LiveInsightEdgeReportsMockContainer {
  reports: Array<LiveInsightEdgeReportChartObject>;
  keyStatistics: Array<ReportMetaData>;

  constructor() {
    this.reports = this.createReports(1);
    this.keyStatistics = [
      new ReportMetaData('Site', 'Texas'),
      new ReportMetaData('Total Anomalies', '4'),
      new ReportMetaData('Total Peak', '600 Kbytes'),
      new ReportMetaData('Total Average', '400 Kbytes'),
      new ReportMetaData('Last Anomaly', 'Dec 2, 2019 20:00 EET (GMT+2:00)'),
    ];
  }

  private createReports(
    numberOfReports: number
  ): Array<LiveInsightEdgeReportChartObject> {
    const reports = new Array<LiveInsightEdgeReportChartObject>();
    for (let i = 0; i < numberOfReports; i++) {
      const data = [
        <ReportTimeSeries<any>>{
          id: 'series1',
          displayName: 'Series 1 Name',
          points: this.createSampleData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.SOLID,
          },
        },
        <ReportTimeSeries<any>>{
          id: 'baseline',
          displayName: 'Baseline',
          points: this.createSampleData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.DASH,
          },
        },
      ];
      const yAxis = {
        label: 'Bandwidth in Kbps',
      };
      const xAxis = {
        label: '',
      };
      const newReport = new ReportTimeSeriesChartData({ data, xAxis, yAxis });
      const liveInsightEdgeReport = new LiveInsightEdgeReportChartObject(
        i,
        <InsightChartHeaderInfo>{
          reportName: 'Report Name',
          title: 'Device Name',
          timeRange: '30 Days',
          direction: ReportDirectionParameter.BOTH,
        },
        newReport
      );
      reports.push(liveInsightEdgeReport);
    }
    return reports;
  }

  private createSampleData() {
    const seriesArray = new Array<
      ReportTimeSeriesDataPoint<LiveInsightPointMetaData>
    >();
    const baselineValue = 60;
    const numberOfPoints = 30;
    const startTime = new Date().getTime();
    const timeSkip = 24 * 3600 * 1000; // 1 day
    let previousValue = baselineValue;
    for (let i = numberOfPoints; i >= 0; i--) {
      const deviation = Math.floor(Math.random() * 5) - 2;
      const newValue = previousValue + deviation;
      previousValue = newValue;
      const newTime = startTime - timeSkip * i;
      const isAnomaly = newValue >= baselineValue;
      seriesArray.push({
        time: newTime,
        value: newValue,
        meta: { isAnomaly: isAnomaly },
      });
    }
    return seriesArray;
  }
}

@Component({
  selector: 'nx-live-insight-edge-predictions-mock-container',
  template: `
    <ng-container *ngFor="let report of reports">
      <nx-live-insight-edge-reports
        [report]="report"
        [reportKeyStatistics]="keyStatistics"
      >
      </nx-live-insight-edge-reports>
    </ng-container>
  `,
})
// @ts-ignore
class LiveInsightEdgePredictionsMockContainer {
  reports: Array<LiveInsightEdgeReportChartObject>;
  keyStatistics: Array<ReportMetaData>;

  constructor() {
    this.reports = this.createReports(1);
    this.keyStatistics = [
      new ReportMetaData('Device', 'PA-CSR-04'),
      new ReportMetaData('Interface', 'TenGigabitEthernet1/1/2'),
      new ReportMetaData(
        'Interface description',
        'PFR auto-tunnel for VRF default'
      ),
      new ReportMetaData(
        'Latest received data',
        format(Date.now(), 'DD MMM YYYY HH:mm ([GMT]Z)')
      ),
      new ReportMetaData(
        'Prediction date',
        format(Date.now() + 24 * 3600 * 1000 * 5, 'DD MMM YYYY')
      ),
    ];
  }

  private createReports(
    numberOfReports: number
  ): Array<LiveInsightEdgeReportChartObject> {
    const reports = new Array<LiveInsightEdgeReportChartObject>();
    for (let i = 0; i < numberOfReports; i++) {
      const data = [
        <ReportTimeSeries<any>>{
          id: 'series1',
          displayName: 'Actual',
          type: ReportTimeSeriesType.STANDARD,
          points: this.createSampleData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.SOLID,
          },
        },
        // <ReportTimeSeries<any>> {
        //   id: 'threshold',
        //   displayName: 'Threshold',
        //   type: ReportTimeSeriesType.THRESHOLD,
        //   points: this.createSampleData(),
        //   configuration: <ReportTimeSeriesConfiguration> {
        //     lineStyle: ReportLineStyle.DASH
        //   }
        // },
        <ReportTimeSeries<any>>{
          id: 'trend',
          displayName: 'Trend',
          type: ReportTimeSeriesType.CURRENT_TREND,
          points: this.createSampleTrendData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.SOLID,
            pointStyle: ReportPointStyle.SOLID,
          },
        },
        <ReportTimeSeries<any>>{
          id: 'predictedTrend',
          displayName: 'Predicted trend',
          type: ReportTimeSeriesType.PROJECTED_TREND,
          points: this.createSampleTrendPredictionData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.DASH,
          },
        },
        <ReportTimeSeries<any>>{
          id: 'capacity',
          displayName: 'Capacity (100Mbps)',
          type: ReportTimeSeriesType.CAPACITY,
          points: this.createCapacityData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.SOLID,
            pointStyle: ReportPointStyle.SOLID,
          },
        },
        <ReportTimeSeries<any>>{
          id: 'prediction',
          displayName: 'Prediction',
          type: ReportTimeSeriesType.PREDICTION,
          points: [
            {
              time: new Date().getTime() + 24 * 3600 * 1000 * 35,
              value: 72,
              meta: { isPrediction: true },
            },
          ],
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.DOT,
            pointStyle: ReportPointStyle.DONUT,
          },
        },
        <ReportTimeSeries<any>>{
          id: '80percent',
          displayName: '80% threshold',
          type: ReportTimeSeriesType.LOWER_THRESHOLD,
          points: this.create80ThresholdData(),
          configuration: <ReportTimeSeriesConfiguration>{
            lineStyle: ReportLineStyle.SOLID,
            pointStyle: ReportPointStyle.PATTERN,
            threshold: 90,
          },
        },
      ];
      const yAxis = {
        label: 'Bit Rate (Mbps)',
      };
      const xAxis: ReportAxisModel = {
        label: '',
        plotLines: [
          {
            color: ChartElementColors.REGENT_GRAY_BASE,
            width: 1,
            dashStyle: ReportLineStyle.DASH,
            value: new Date().getTime(),
          },
        ],
      };
      const newReport = new ReportTimeSeriesChartData({ data, xAxis, yAxis });
      const liveInsightEdgeReport = new LiveInsightEdgeReportChartObject(
        i,
        <InsightChartHeaderInfo>{
          reportName: 'WAN Interface Utilization Baselining',
          title: 'Site: Palo Alto → Service provider: MPLS',
          direction: ReportDirectionParameter.BOTH,
        },
        newReport
      );
      reports.push(liveInsightEdgeReport);
    }
    return reports;
  }

  private createSampleData() {
    const seriesArray = new Array<
      ReportTimeSeriesDataPoint<LiveInsightPointMetaData>
    >();
    const baselineValue = 60;
    const numberOfPoints = 36;
    const endTime = new Date().getTime();
    const timeSkip = 24 * 3600 * 1000 * 10; // 10 days
    let previousValue = baselineValue;
    for (let i = numberOfPoints; i >= 0; i--) {
      const deviation = Math.floor(Math.random() * 5) - 2;
      const newValue = previousValue + deviation;
      previousValue = newValue;
      const newTime = endTime - timeSkip * i;
      const isAnomaly = newValue >= baselineValue;
      seriesArray.push({
        time: newTime,
        value: newValue,
        meta: { isAnomaly: isAnomaly },
      });
    }
    return seriesArray;
  }

  private createSampleTrendData() {
    const seriesArray = new Array<
      ReportTimeSeriesDataPoint<LiveInsightPointMetaData>
    >();
    const endTime = new Date().getTime();
    const startTime = endTime - 24 * 3600 * 1000 * 360;
    seriesArray.push({ time: startTime, value: 0, meta: {} });
    seriesArray.push({ time: endTime, value: 60, meta: {} });
    return seriesArray;
  }

  private createSampleTrendPredictionData() {
    const seriesArray = new Array<
      ReportTimeSeriesDataPoint<LiveInsightPointMetaData>
    >();
    const startTime = new Date().getTime();
    const endTime = startTime + 24 * 3600 * 1000 * 120;
    seriesArray.push({ time: startTime, value: 60, meta: {} });
    seriesArray.push({ time: endTime, value: 100, meta: {} });
    return seriesArray;
  }

  private createCapacityData() {
    const seriesArray = new Array<
      ReportTimeSeriesDataPoint<LiveInsightPointMetaData>
    >();
    const currTime = Date.now();
    const endTime = currTime + 24 * 3600 * 1000 * 120;
    const startTime = currTime - 24 * 3600 * 1000 * 360;
    seriesArray.push({ time: startTime, value: 90, meta: {} });
    seriesArray.push({ time: endTime, value: 90, meta: {} });
    return seriesArray;
  }

  private create80ThresholdData() {
    const seriesArray = new Array<
      ReportTimeSeriesDataPoint<LiveInsightPointMetaData>
    >();
    const currTime = Date.now();
    const endTime = currTime + 24 * 3600 * 1000 * 120;
    const startTime = currTime - 24 * 3600 * 1000 * 360;
    seriesArray.push({ time: startTime, value: 72, meta: {} });
    seriesArray.push({ time: endTime, value: 72, meta: {} });
    return seriesArray;
  }
}

export default {
  title:
    'LiveInsightEdge/LiveInsight Edge Reports/LiveInsightEdgeReportsComponent',

  decorators: [
    moduleMetadata({
      declarations: [
        LiveInsightEdgeReportsComponent,
        LiveInsightEdgeReportsMockContainer,
        LabeledCardComponent,
        CardComponent,
        TimeSeriesChartComponent,
        ChartWidgetComponent,
        KeyValueListItemDirective,
        KeyValueListComponent,
        HorizontalLegendComponent,
        SpinnerComponent,
        NoDataMessageComponent,
        SimpleAlertComponent,
        SkeletonScreenComponent,
        LoadingComponent,
      ],
    }),
  ],
};

export const Default = () => ({
  component: LiveInsightEdgeReportsMockContainer,
});

Default.story = {
  name: 'default',
};

export const Predictions = () => ({
  component: LiveInsightEdgePredictionsMockContainer,
});

export const Loading = () => ({
  props: {
    isLoading: true,
  },
  component: LiveInsightEdgeReportsComponent,
});

Loading.story = {
  name: 'loading',
};

export const Error = () => ({
  props: {
    errorMessage: 'There is an error getting data.',
  },
  component: LiveInsightEdgeReportsComponent,
});

Error.story = {
  name: 'error',
};
