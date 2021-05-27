import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {CommonService} from '../../../../utils/common/common.service';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ReportRequest} from '../../../reporting/models/api/request/sub/report-request';
import ReportCategoryParameter from '../../../reporting/models/api/parameter-enums/report-category-parameter';
import {ReportRequestBuilder} from '../../../reporting/builders/report-request-builder/report-request-builder';
import {DashboardWidgetConfig} from '../../../dashboard/components/dashboard-widget/dashboard-widget-config';
import {ReportGroupRequestBuilder} from '../../../reporting/builders/report-group-builder/report-group-request-builder';
import {QueueReportGroupRequest} from '../../../reporting/models/api/request/queue-report-group-request';
import ReportClassificationContext from '../../../reporting/models/api/request/enums/report-classification-context';
import {ReportPriority} from '../../../reporting/models/api/request/enums/report-priority';
import {ReportWidgetDataProviderService} from '../../../dashboard/services/report-widget-data-provider/report-widget-data-provider.service';
import WidgetDataProvider from '../../../dashboard/containers/dashboard-widget/widget-data-provider';
import {filter, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {DeviceCurrentFlowsForm} from '../../components/device-current-flows-tab/device-current-flows-form';
import {ReportInfoService} from '../../../reporting/services/report-info/report-info.service';
import {ReportInfoValue} from '../../../reporting/models/report-info';
import AvailableParameter from '../../../reporting/models/available-parameter';
import {DeviceCurrentFlowsTabComponent} from '../../components/device-current-flows-tab/device-current-flows-tab.component';
import ReportFlowTypeParameter from '../../../reporting/models/api/parameter-enums/report-flow-type-parameter';
import {DashboardWidgetFilteredTableContainer} from '../../../dashboard/containers/dashboard-widget-filtered-table/dashboard-widget-filtered-table-container.component';
import {FilteredReportTableConfigGeneratorService} from '../../../dashboard/services/filtered-report-table-config-generator/filtered-report-table-config-generator.service';
import {FilteredReportTableDataGeneratorOptions} from '../../../dashboard/services/filtered-report-table-config-generator/filtered-report-table-data-generator-options';
import {ServerTimeService} from '../../../../services/server-time/server-time.service';
import {FilterService} from '../../../filter/services/filter/filter.service';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import DetailedError from '../../../shared/components/loading/detailed-error';
import {ReportTableDataGeneratorOptionsColumn} from '../../../dashboard/services/report-table-config-generator/report-table-data-generator-options-column';
import {DatetimeCellRendererComponent} from '../../../grid/components/cell-renders/datetime-cell-renderer/datetime-cell-renderer.component';
import {TimeConstants} from 'src/app/constants/time.constants';
import { FilterValue } from '../../../filter/interfaces/filter-value';

interface CurrentFlowWidgetDataParams {
  deviceSerial: string;
  flowType: ReportFlowTypeParameter;
  flexSearch: string;
}

@UntilDestroy()
@Component({
  selector: 'nx-device-current-flow-tab-container',
  template: `
    <nx-device-current-flows-tab
      *ngIf="deviceSerial"
      [isLoading]="isLoading$ | async"
      [error]="error$ | async"
      [currentFlowsWidget]="currentFlowsWidget"
      [flowTypeParameter]="flowTypeParameter$ | async"
      [deviceName]="deviceName"
      (formChange)="formUpdateHandler($event)">
    </nx-device-current-flows-tab>
  `,
  styles: [],
  providers: [
    {provide: WidgetDataProvider, useExisting: ReportWidgetDataProviderService},
    FilterService
  ]
})
export class DeviceCurrentFlowTabContainer implements OnInit, OnChanges, OnDestroy {
  static readonly ROW_LIMIT = 200;
  static readonly DATA_KEY = 'device-current-flows-tab';
  static readonly WIDGET_NAME = 'Current Device Flows';
  static readonly REPORT_ID = 90;
  static readonly REPORT_CATEGORY = ReportCategoryParameter.FLOW;

  @Input() isAutoRefresh: boolean;
  @Input() deviceSerial: string;
  @Input() deviceName: string;

  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  flowTypeParameter$: Observable<AvailableParameter>;

  widgetParams: CurrentFlowWidgetDataParams = {flowType: void 0, deviceSerial: void 0, flexSearch: void 0};
  updateDataSub = new BehaviorSubject<CurrentFlowWidgetDataParams>(this.widgetParams);
  private refreshTime: number;

  timerSubscription: Subscription;
  currentFlowsWidget: DashboardWidgetConfig;

  constructor(private commonService: CommonService,
              private widgetDataProvider: ReportWidgetDataProviderService,
              private reportInfoService: ReportInfoService,
              private serverTimeService: ServerTimeService,
              private filterService: FilterService) {
    this.refreshTime = TimeConstants.TWO_MINUTES;
    const portColumn: ReportTableDataGeneratorOptionsColumn = {
      cellRenderComponent: null
    };
    this.isLoading$ = reportInfoService.selectLoading();
    this.error$ = reportInfoService.selectError();
    this.currentFlowsWidget = {
      id: 'device-current-flows-tab-id',
      dataKey: DeviceCurrentFlowTabContainer.DATA_KEY,
      headerTitle: DeviceCurrentFlowTabContainer.WIDGET_NAME,
      headerSubtitle: '',
      timeLabel: '',
      visualComponent: DashboardWidgetFilteredTableContainer,
      visualDataGenerator: FilteredReportTableConfigGeneratorService,
      visualGeneratorOptions: <FilteredReportTableDataGeneratorOptions>{
        hideGlobalSearch: true,
        sortable: true,
        filterable: true,
        columns: {
          destinationTransportPort: portColumn,
          sourceTransportPort: portColumn,
          'ipPrecedence': <ReportTableDataGeneratorOptionsColumn>{label: 'IP Precedence'},
          'paddingOctets': <ReportTableDataGeneratorOptionsColumn>{label: 'Padding Octets'},
          'liveactionRecordCount': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'liveactionBitRate': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'liveactionPacketRate': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'octetTotalCount': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'octetDeltaCount': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'packetTotalCount': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'packetDeltaCount': <ReportTableDataGeneratorOptionsColumn>{rightAligned: true},
          'flowStartMilliseconds': {cellRenderComponent: DatetimeCellRendererComponent},
          'flowEndMilliseconds': {cellRenderComponent: DatetimeCellRendererComponent}
        }
      }
    };
  }

  ngOnInit(): void {
    this.flowTypeParameter$ = this.reportInfoService.getReportInfoById(
      DeviceCurrentFlowTabContainer.REPORT_ID,
      DeviceCurrentFlowTabContainer.REPORT_CATEGORY)
      .pipe(
        untilDestroyed(this),
        map((reportInfo: ReportInfoValue) => {
          return reportInfo.availableParameters.find(
            (param: AvailableParameter) => {
              return param.queryKey === DeviceCurrentFlowsTabComponent.FLOW_TYPE_KEY;
            });
        }),
        tap(((flowTypeParameter: AvailableParameter) => {
            this.widgetParams.flowType = <ReportFlowTypeParameter>flowTypeParameter.defaultValue.apiValue;
            this.updateDataSub.next(this.widgetParams);
          })
        ));

    this.updateDataSub.asObservable()
      .pipe(
        filter((data: CurrentFlowWidgetDataParams) => (data.deviceSerial != null && data.flowType != null)),
        switchMap((data: CurrentFlowWidgetDataParams) => {
          return this.updateData(data);
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.commonService.isNil(changes?.deviceSerial?.currentValue)) {
      this.widgetParams.deviceSerial = changes.deviceSerial.currentValue;
      this.updateDataSub.next(this.widgetParams);
    }

    if (!this.commonService.isNil(changes?.isAutoRefresh?.currentValue)) {
      const isAutoRefresh: boolean = changes.isAutoRefresh.currentValue;
      if (isAutoRefresh) {
        this.updateDataSub.next(this.widgetParams);
        this.beginTimer();
      } else {
        this.stopTimer();
      }
    }
  }

  ngOnDestroy() {
    this.updateDataSub.complete();
  }

  beginTimer(): void {
    this.timerSubscription = timer(this.refreshTime, this.refreshTime)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.updateDataSub.next(this.widgetParams);
      });
  }

  stopTimer(): void {
    if (!this.commonService.isNil(this.timerSubscription)) {
      this.timerSubscription.unsubscribe();
    }
  }

  restartTimer(): void {
    this.stopTimer();
    this.beginTimer();
  }

  updateData(data: CurrentFlowWidgetDataParams): Observable<Array<ReportResponse>> {
    // server time to nearest minute
    return this.serverTimeService.getServerTime(1000 * 60)
      .pipe(
        take(1),
        mergeMap((endTime: number) => {
          const reportRequest: ReportRequest = new ReportRequestBuilder()
            .setReportId(DeviceCurrentFlowTabContainer.REPORT_ID, DeviceCurrentFlowTabContainer.REPORT_CATEGORY)
            .setParameters({
              flowType: data.flowType,
              flexSearch: data.flexSearch,
              deviceSerial: data.deviceSerial,
              startTime: endTime - this.refreshTime,
              endTime: endTime,
              topAnalysisLimit: DeviceCurrentFlowTabContainer.ROW_LIMIT
            })
            .build();
          const reportGroupRequest: QueueReportGroupRequest = new ReportGroupRequestBuilder(
            DeviceCurrentFlowTabContainer.WIDGET_NAME,
            ReportClassificationContext.ENTITY,
            ReportPriority.P2,
            [reportRequest]
          ).build();

          return this.widgetDataProvider.requestData([{
            requestKey: DeviceCurrentFlowTabContainer.DATA_KEY,
            reportRequest: reportGroupRequest
          }]);
        })
      );
  }

  formUpdateHandler(updateForm: DeviceCurrentFlowsForm): void {
    this.refreshTime = updateForm.timeRange;
    this.widgetParams.flowType = <ReportFlowTypeParameter>updateForm[DeviceCurrentFlowsTabComponent.FLOW_TYPE_KEY];
    if (this.commonService.isEmpty(updateForm.flexSearch)) {
      this.widgetParams.flexSearch = void 0;
    } else {
      const items = updateForm[DeviceCurrentFlowsTabComponent.FLEX_SEARCH_KEY] as FilterValue;
      this.widgetParams.flexSearch = this.filterService.buildFlexSearchString(items);
    }
    if (this.isAutoRefresh) {
      this.restartTimer();
    }
    this.updateDataSub.next(this.widgetParams);
  }
}
