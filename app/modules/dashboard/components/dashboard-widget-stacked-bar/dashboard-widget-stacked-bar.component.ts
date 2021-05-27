import {Component, OnInit, Self} from '@angular/core';
import {WidgetVisualComponent} from '../../containers/dashboard-widget/widget-visual.component';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';
import {ReportStackedBarDataGeneratorService} from '../../services/report-stacked-bar-data-generator/report-stacked-bar-data-generator.service';
import ReportStackedBarTimeSeriesChartData from '../../../reporting/models/charts/stacked-bar-time-series/report-stacked-bar-time-series-chart-data.model';

@Component({
  selector: 'nx-dashboard-widget-stacked-bar',
  templateUrl: './dashboard-widget-stacked-bar.component.html',
  styleUrls: ['./dashboard-widget-stacked-bar.component.less'],
  providers: [ReportStackedBarDataGeneratorService]
})
export class DashboardWidgetStackedBarComponent implements OnInit,
    WidgetVisualComponent<ReportStackedBarTimeSeriesChartData, any> {

  config: any;
  data: ReportStackedBarTimeSeriesChartData;

  constructor(@Self() private stackedBarConfigGenerator: ReportStackedBarDataGeneratorService) { }

  ngOnInit(): void {
  }

  get dataGenerator(): VisualDataGenerator {
    return this.stackedBarConfigGenerator;
  }

}
