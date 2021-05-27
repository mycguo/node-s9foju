import { Injectable } from '@angular/core';
import {ChartPointFactory} from '../chart-series-factory/chart-point-factory';
import LiveInsightPointMetaData from '../../modules/reporting/models/charts/points/live-insight-point-meta-data';
import ReportTimeSeriesDataPoint from '../../modules/reporting/models/charts/time-series/report-time-series-data-point';
import {PointMarkerOptionsObject, PointOptionsObject} from 'highcharts';
import {ChartElementColors} from '../../modules/shared/components/chart-widget/constants/chart-element-colors.enum';

@Injectable({
  providedIn: 'root'
})
export class LiveInsightTimeSeriesPointFactoryService implements ChartPointFactory<LiveInsightPointMetaData> {

  constructor() { }

  createChartPoint(point: ReportTimeSeriesDataPoint<LiveInsightPointMetaData>): PointOptionsObject | [number, number] {
    let marker: PointMarkerOptionsObject = {};
    let color: string;
    if (point.meta?.isAnomaly) {
      marker = {
        lineColor: '#fff',
        lineWidth: 2,
        radius: 5,
        states: {
          hover: {
            radius: 6
          }
        }
      };
      color = ChartElementColors.RED_ORANGE_BASE;
    }
    if (point.meta?.isPrediction) {
      marker = {
        lineColor: ChartElementColors.RED_ORANGE_BASE,
        fillColor: '#fff',
        lineWidth: 2,
        radius: 4,
        states: {
          hover: {
            radius: 6
          }
        }
      };
    }
    return {
      x: point.time,
      y: point.value,
      color,
      marker
    };
  }
}
