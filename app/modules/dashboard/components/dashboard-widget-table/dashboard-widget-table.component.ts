import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, Self, SimpleChanges} from '@angular/core';
import {WidgetVisualComponent} from '../../containers/dashboard-widget/widget-visual.component';
import GridData from '../../../grid/models/grid-data.model';
import {DashboardWidgetTableConfig} from './dashboard-widget-table-config';
import {ReportTableDataGeneratorService} from '../../services/report-table-config-generator/report-table-data-generator.service';
import {VisualDataGenerator} from '../../containers/dashboard-widget/visual-data-generator';

@Component({
  selector: 'nx-dashboard-widget-table',
  templateUrl: './dashboard-widget-table.component.html',
  styleUrls: ['./dashboard-widget-table.component.less'],
  providers: [ReportTableDataGeneratorService]
})
export class DashboardWidgetTableComponent implements OnInit, OnChanges,
  WidgetVisualComponent<Array<{ [key: string]: any }>, DashboardWidgetTableConfig> {

  // This allows data to still be set through inputs while allowing behavior set for data field on interface.
  // tslint:disable-next-line:no-input-rename
  @Input('data') dataInternal: Array<{ [key: string]: any }>;

  @Input() config: DashboardWidgetTableConfig;

  gridData: GridData<{ [key: string]: string }>;

  constructor(@Self() private tableConfigGenerator: ReportTableDataGeneratorService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.gridData = new GridData(this.data);
  }

  get data(): Array<{ [key: string]: any }> {
    return this.dataInternal;
  }

  set data(data: Array<{ [key: string]: any }>) {
    if (data != null) {
      this.dataInternal = data;
      this.gridData = new GridData(data);
      // Force change detection since this is external to normal angular change detection.
      // This set could come from a direct data assignment after dynamic widget creation.
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataInternal.currentValue != null && !changes.dataInternal.isFirstChange()) {
      this.gridData = new GridData(this.dataInternal);
    }
  }

  get dataGenerator(): VisualDataGenerator {
    return this.tableConfigGenerator;
  }

}
