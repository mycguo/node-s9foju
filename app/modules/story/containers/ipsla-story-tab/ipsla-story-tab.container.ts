import {Component, Input, OnInit} from '@angular/core';
import {DashboardWidgetFilteredTableContainer} from '../../../dashboard/containers/dashboard-widget-filtered-table/dashboard-widget-filtered-table-container.component';
import {FilteredReportTableConfigGeneratorService} from '../../../dashboard/services/filtered-report-table-config-generator/filtered-report-table-config-generator.service';
import {FilteredReportTableDataGeneratorOptions} from '../../../dashboard/services/filtered-report-table-config-generator/filtered-report-table-data-generator-options';
import {DashboardWidgetConfig} from '../../../dashboard/components/dashboard-widget/dashboard-widget-config';
import {QueueReportGroupRequest} from '../../../reporting/models/api/request/queue-report-group-request';
import {ReportGroupRequestBuilder} from '../../../reporting/builders/report-group-builder/report-group-request-builder';
import ReportClassificationContext from '../../../reporting/models/api/request/enums/report-classification-context';
import {ReportPriority} from '../../../reporting/models/api/request/enums/report-priority';
import WidgetDataProvider from '../../../dashboard/containers/dashboard-widget/widget-data-provider';
import {ReportRequestBuilder} from '../../../reporting/builders/report-request-builder/report-request-builder';
import ReportCategoryParameter from '../../../reporting/models/api/parameter-enums/report-category-parameter';
import {ReportIpslaStatAggregationType} from '../../../reporting/models/api/parameter-enums/report-ipsla-stat-aggregation-type.enum';
import {ReportIpslaType} from '../../../reporting/models/api/parameter-enums/report-ipsla-type.enum';
import {ServerTimeService} from '../../../../services/server-time/server-time.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ReportAddlWidgetDataProviderService} from '../../../dashboard/services/report-addl-widget-data-provider/report-addl-widget-data-provider.service';
import {ErrorCellRendererComponent} from '../../../grid/components/cell-renders/error-cell-renderer/error-cell-renderer.component';
import {PopUpService} from '../../../shared/services/pop-up/pop-up.service';
import {IpslaStatusPopUpComponent} from '../../components/ipsla-status-pop-up/ipsla-status-pop-up.component';
import {GridColumnFiltersService} from '../../../grid/services/grid-column-filters/grid-column-filters.service';
import {DrillDownCellRenderComponent} from '../../../grid/components/cell-renders/drill-down-cell-render/drill-down-cell-render.component';
import {IpslaStoryRowStrategyService} from '../../services/ipsla-story-row-strategy/ipsla-story-row-strategy.service';
import {IpslaTestStatusPopUpData} from '../../components/ipsla-status-pop-up/interfaces/ipsla-test-status-pop-up-data';
import {ErrorCellValue} from '../../../grid/components/cell-renders/error-cell-renderer/enums/error-cell-value.enum';
import {SelectOption} from '../../../shared/components/form/select/models/select-option';
import {ipslaTypeNames} from '../../constants/ipsla-type-record.constant';
import {SelectService} from '../../../shared/services/select/select.service';
import {FilteredReportTableGeneratorOptionColumn} from '../../../dashboard/services/filtered-report-table-config-generator/filtered-report-table-generator-option-column';
import {Observable, throwError} from 'rxjs';
import {CommonService} from '../../../../utils/common/common.service';
import {DeviceStrategyService} from '../../../dashboard/services/report-table-config-generator/data-strategies/device-strategy/device-strategy.service';
import {ReportDrilldownService} from '../../../reporting/services/report-drilldown/report-drilldown.service';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {TimeConstants} from '../../../../constants/time.constants';

@Component({
  selector: 'nx-ipsla-story-tab-container',
  template: `
    <nx-ipsla-story-tab [tableWidget]="tableWidget$ | async"
                        [error]="error"
                        [widgetId]="widgetId">
    </nx-ipsla-story-tab>
  `,
  styles: [':host { display: block; height: 100%; }'],
  providers: [
    {provide: WidgetDataProvider, useExisting: ReportAddlWidgetDataProviderService}
  ]
})
export class IpslaStoryTabContainer implements OnInit {
  private static readonly REPORT_COLUMN_KEY = 'Reports';
  private static readonly IPSLA_REPORT_ID = '5';

  @Input() id: ReportIpslaType;
  @Input() columns: { [key: string]: FilteredReportTableGeneratorOptionColumn };
  @Input() grouped: Array<{ name: string, props: Array<string> }>;
  @Input() ipslaStatAggregationType: ReportIpslaStatAggregationType;

  widgetId: string;
  ipslaStoryRowStrategyService: IpslaStoryRowStrategyService;
  tableWidget$: Observable<DashboardWidgetConfig>;
  error: DetailedError;

  constructor(private commonService: CommonService,
              private widgetDataProvider: ReportAddlWidgetDataProviderService,
              private serverTimeService: ServerTimeService,
              private gridColumnFiltersService: GridColumnFiltersService,
              private popUpService: PopUpService,
              private selectService: SelectService,
              private deviceStrategyService: DeviceStrategyService,
              private reportDrilldownService: ReportDrilldownService) {
    this.ipslaStoryRowStrategyService = new IpslaStoryRowStrategyService(
      deviceStrategyService,
      reportDrilldownService,
      IpslaStoryTabContainer.REPORT_COLUMN_KEY
    );
  }

  ngOnInit(): void {
    const id = this.commonService.toKebabCase(this.id);
    const dataKey = `ipsla-story-${id}-data-key`;
    const widgetName = `IP SLA Story ${id} Tab`;
    this.widgetId = `ipsla-story-${id}-widget`;
    const tableWidget: DashboardWidgetConfig = {
      id: `ipsla-story-${id}-tab-id`,
      dataKey: dataKey,
      headerTitle: widgetName,
      headerSubtitle: '',
      timeLabel: '',
      visualComponent: DashboardWidgetFilteredTableContainer,
      visualDataGenerator: FilteredReportTableConfigGeneratorService,
      visualGeneratorOptions: <FilteredReportTableDataGeneratorOptions<IpslaStoryRowStrategyService>>{
        sortable: true,
        filterable: true,
        visualDataStrategy: this.ipslaStoryRowStrategyService,
        hiddenColumns: ['TestStatusReason'],
        grouped: [
          {name: 'Properties', props: ['Tag', 'DeviceSerial', 'DestinationOrUrl']},
          {
            name: 'Round Trip Latency (ms)',
            props: ['RoundTripLatencyMin', 'RoundTripLatencyAvg', 'RoundTripLatencyMax']
          },
          {
            name: 'Errors',
            props: ['Busies', 'NoConnections', 'Disconnects', 'SequenceErrors', 'TimeOuts', 'VerifyErrors']
          },
          {name: 'Latency (ms) Src → Dst', props: ['LatencySrcToDstMin', 'LatencySrcToDstAvg', 'LatencySrcToDstMax']},
          {name: 'Latency (ms) Dst → Src', props: ['LatencyDstToSrcMin', 'LatencyDstToSrcAvg', 'LatencyDstToSrcMax']},
          {name: 'Latency (ms)', props: ['LatencySrcToDst', 'LatencyDstToSrc']},
          {name: 'Jitter (ms)', props: ['JitterSrcToDst', 'JitterDstToSrc']},
          ...this.grouped ?? []
        ],
        columns: {
          'TestStatus': {
            cellClass: 'ag-cell_align-center ag-cell_has-pointer-events',
            onCellClicked: this.handleStatusCellClick.bind(this),
            minWidth: 105
          },
          'ID': {
            cellClass: 'ag-cell_number'
          },
          'GroupID': {
            cellClass: 'ag-cell_number'
          },
          'Type': {
            filter: this.gridColumnFiltersService.buildSelectColumnFilter('Type', {
              options: this.getTypesList()
            }),
            minWidth: 120
          },
          'Error': {
            cellRenderComponent: ErrorCellRendererComponent,
            filter: this.gridColumnFiltersService.buildSelectColumnFilter('Error', {
              options: this.getErrorList()
            }),
            minWidth: 195
          },
          'Attempts': {
            filterable: false
          },
          'RoundTripLatencyMin': {label: 'Min'},
          'RoundTripLatencyAvg': {label: 'Avg'},
          'RoundTripLatencyMax': {label: 'Max'},
          'LatencySrcToDstMin': {label: 'Min'},
          'LatencySrcToDstAvg': {label: 'Avg'},
          'LatencySrcToDstMax': {label: 'Max'},
          'LatencyDstToSrcMin': {label: 'Min'},
          'LatencyDstToSrcAvg': {label: 'Avg'},
          'LatencyDstToSrcMax': {label: 'Max'},
          'LatencySrcToDst': {label: 'Src → Dst'},
          'LatencyDstToSrc': {label: 'Dst → Src'},
          'JitterSrcToDst': {label: 'Src → Dst'},
          'JitterDstToSrc': {label: 'Dst → Src'},
          [IpslaStoryTabContainer.REPORT_COLUMN_KEY]: {
            label: IpslaStoryTabContainer.REPORT_COLUMN_KEY,
            sortable: false,
            cellRenderComponent: DrillDownCellRenderComponent,
            cellClass: 'ag-cell_align-center',
            filterable: false,
          },
          ...this.columns
        },
        additionalColumns: [{index: 1, prop: IpslaStoryTabContainer.REPORT_COLUMN_KEY}]
      }
    };

    this.tableWidget$ = this.serverTimeService.getServerTime()
      .pipe(
        switchMap((endTime: number) => {
          const startTime = endTime - TimeConstants.FIFTEEN_MINUTES;
          this.ipslaStoryRowStrategyService.endTime = endTime;
          this.ipslaStoryRowStrategyService.startTime = startTime;
          const reportDef = new ReportRequestBuilder()
            .setReportId(IpslaStoryTabContainer.IPSLA_REPORT_ID, ReportCategoryParameter.IPSLA)
            .setParameters({
              ipslaStatAggregationType: this.ipslaStatAggregationType,
              ipslaType: this.id,
              endTime: endTime,
              startTime: startTime
            })
            .build();

          const reportGroupRequest: QueueReportGroupRequest = new ReportGroupRequestBuilder(
            widgetName,
            ReportClassificationContext.WORKFLOW,
            ReportPriority.P2,
            [reportDef]
          ).build();

          return this.widgetDataProvider.requestData([{
            requestKey: dataKey,
            reportRequest: reportGroupRequest
          }]);
        }),
        map(() => tableWidget),
        catchError((err) => {
          this.error = Object.assign({title: void 0}, err);
          return throwError(err);
        })
      );
  }

  private handleStatusCellClick($event): void {
    this.popUpService.open(
      {
        origin: $event.event.target.hasAttribute('nx-status-indicator') ? $event.event.target : $event.event.target.querySelector('[nx-status-indicator]'),
        componentRef: IpslaStatusPopUpComponent,
        data: {
          testName: $event.data['Type'],
          drilldown: $event.data[IpslaStoryTabContainer.REPORT_COLUMN_KEY],
          testStatus: $event.data['TestStatus'],
          testStatusReason: $event.data['TestStatusReason']
        } as IpslaTestStatusPopUpData
      }
    );
  }

  private getTypesList(): Array<SelectOption> {
    const typesList: Array<SelectOption> = [];
    ipslaTypeNames.forEach((value: string, key: ReportIpslaType) => {
      if (key !== ReportIpslaType.ALL) {
        typesList.push(new SelectOption(value, value));
      }
    });
    return typesList.sort(this.selectService.sortSelectOption);
  }

  private getErrorList(): Array<SelectOption> {
    return Object.values(ErrorCellValue).map((val: string) => {
      return new SelectOption(val, val);
    }).sort(this.selectService.sortSelectOption);
  }
}
