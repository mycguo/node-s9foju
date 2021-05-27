import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { GridModule } from '../../../grid/grid.module';
import { DashboardWidgetComponent } from '../../components/dashboard-widget/dashboard-widget.component';
import { WidgetVisualDirective } from '../../directives/widget-visual.directive';
import { DashboardWidgetTableComponent } from '../../components/dashboard-widget-table/dashboard-widget-table.component';
import { DashboardWidgetVisualComponent } from '../../components/dashboard-widget-visual/dashboard-widget-visual.component';
import { DashboardWidgetContainer } from './dashboard-widget.container';
import { Component } from '@angular/core';
import WidgetDataProvider from './widget-data-provider';
import { ReportWidgetDataProviderService } from '../../services/report-widget-data-provider/report-widget-data-provider.service';
import { QueueReportGroupRequest } from '../../../reporting/models/api/request/queue-report-group-request';
import { Observable, of } from 'rxjs';
import ReportResponse from '../../../reporting/models/api/response/report-response';
import ReportDirectionParameter from '../../../reporting/models/api/parameter-enums/report-direction-parameter';
import ReportSortByParameter from '../../../reporting/models/api/parameter-enums/report-sort-by-parameter';
import ReportExecutionTypeParameter from '../../../reporting/models/api/parameter-enums/report-execution-type-parameter';
import { ReportPresentationMode } from '../../../reporting/models/api/request/enums/report-presentation-mode';
import InfoElementType from '../../../reporting/models/enums/info-element-type';
import { ReportResultMetadataType } from '../../../reporting/models/api/response/enums/report-result-metadata-type';
import { ReportResultState } from '../../../reporting/models/api/response/sub/report-result-state';
import { ReportService } from '../../../reporting/services/report/report.service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

class MockReportService {
  public executeReport(
    queueRequest: QueueReportGroupRequest
  ): Observable<ReportResponse> {
    return of({
      meta: {
        href:
          'https://10.2.101.102:8093/v1/reports/results/7400dd1d-de31-4d3a-964f-c1f7f54969df',
        http: {
          method: 'GET',
          statusCode: 200,
          statusReason: 'OK',
        },
      },
      metadata: {
        version: 5,
        id: '7400dd1d-de31-4d3a-964f-c1f7f54969df',
        name: 'Application (Analytics), Last Fifteen Minutes',
        queuedTime: '2020-04-16T17:41:06.474789700Z',
        insertionTime: '2020-04-16T17:41:07.940786900Z',
        expirationTime: '2020-04-17T17:41:07.940786900Z',
        username: 'admin',
        visibility: 'private',
        state: 'COMPLETED',
        queueName: 'normal',
        priority: 'P4',
        type: 'adhoc',
        additionalMetadata: {
          type: 'adhoc',
          jobInfo: {
            name: 'Application (Analytics), Last Fifteen Minutes',
            reports: [
              {
                reportInfo: {
                  id: '6',
                  reportCategory: 'test',
                  reportBase: 'APPLICATIONS_REPORT',
                  name: 'Application (Analytics)',
                  isSavedReport: false,
                  allowsAllDevices: true,
                  allowsAllWanDevices: true,
                  allowsAllInterfaces: true,
                  availableParameters: [
                    {
                      queryKey: 'deviceSerial',
                      parameterType: 'DeviceSerialParameter',
                    },
                    {
                      queryKey: 'executionType',
                      parameterType: 'ExecutionTypeParameter',
                      defaultValue: {
                        apiValue: 'aggregation',
                        displayValue: 'Aggregation',
                      },
                      availableValues: [
                        {
                          apiValue: 'aggregation',
                          displayValue: 'Aggregation',
                        },
                        {
                          apiValue: 'timeseries',
                          displayValue: 'Time Series',
                        },
                      ],
                    },
                    {
                      queryKey: 'endTime',
                      parameterType: 'EndDateParameter',
                    },
                    {
                      queryKey: 'flexSearch',
                      parameterType: 'FlexSearchParameter',
                      defaultValue: {
                        apiValue: null,
                        displayValue: null,
                      },
                    },
                    {
                      queryKey: 'interface',
                      parameterType: 'DeviceInterfaceParameter',
                    },
                    {
                      queryKey: 'startTime',
                      parameterType: 'StartDateParameter',
                    },
                    {
                      queryKey: 'sortBy',
                      parameterType: 'TotalDataSortByParameter',
                      defaultValue: {
                        apiValue: 'BYTE',
                        displayValue: 'Bytes',
                      },
                      availableValues: [
                        {
                          apiValue: 'BIT_RATE',
                          displayValue: 'Bit Rate',
                        },
                        {
                          apiValue: 'BYTE',
                          displayValue: 'Bytes',
                        },
                        {
                          apiValue: 'PACKET_RATE',
                          displayValue: 'Packet Rate',
                        },
                        {
                          apiValue: 'PACKET',
                          displayValue: 'Packets',
                        },
                        {
                          apiValue: 'FLOW',
                          displayValue: 'Flow',
                        },
                      ],
                    },
                    {
                      queryKey: 'direction',
                      parameterType: 'FlowDirectionParameter',
                      defaultValue: {
                        apiValue: 'outbound',
                        displayValue: 'Outbound',
                      },
                      availableValues: [
                        {
                          apiValue: 'inbound',
                          displayValue: 'Inbound',
                        },
                        {
                          apiValue: 'outbound',
                          displayValue: 'Outbound',
                        },
                        {
                          apiValue: 'both',
                          displayValue: 'Inbound and Outbound Combined',
                        },
                      ],
                    },
                  ],
                },
                parameters: {
                  deviceSerial: 'ALL_WAN_DEVICES',
                  executionType: ReportExecutionTypeParameter.AGGREGATION,
                  endTime: '1587058866385',
                  flexSearch: null,
                  interface: 'All Interfaces',
                  startTime: '1587057966385',
                  sortBy: ReportSortByParameter.BYTES,
                  direction: ReportDirectionParameter.OUTBOUND,
                },
                reportName: null,
                reportDescription: null,
              },
            ],
            sharingConfig: [],
            visibility: 'private',
            callback: 'http://10.2.192.80:9000/api/la-reports/notify',
            timeZone: {
              id: 'Pacific/Honolulu',
              enableDst: false,
              supportsDst: false,
              standardOffset: -36000,
            },
            clientTimeParameters: {
              timeZone: {
                id: 'Pacific/Honolulu',
                enableDst: false,
              },
              relativeQueryTime: 900,
              startTimeInMillis: 0,
              endTimeInMillis: 0,
              customTime: false,
            },
            time: '2020-04-16T17:41:06.474789700Z',
            presentationMode: ReportPresentationMode.STANDARD,
            status:
              'https://10.2.101.102:8093/v1/reports/queue/7400dd1d-de31-4d3a-964f-c1f7f54969df',
            result:
              'https://10.2.101.102:8093/v1/reports/results/7400dd1d-de31-4d3a-964f-c1f7f54969df',
            reportFootNote: '',
            globalReportParameters: {
              flexSearch: '',
              displayFilter: '',
            },
            logo: {
              id: null,
            },
          },
        },
        executionStartTime: '2020-04-16T17:41:06.474789700Z',
      },
      results: [
        {
          state: ReportResultState.SUCCESS,
          reportInfo: {
            id: '6',
            reportCategory: 'test',
            reportBase: 'APPLICATIONS_REPORT',
            name: 'Application (Analytics)',
            isSavedReport: false,
            allowsAllDevices: true,
            allowsAllWanDevices: true,
            allowsAllInterfaces: true,
            availableParameters: [
              {
                queryKey: 'deviceSerial',
                parameterType: 'DeviceSerialParameter',
              },
              {
                queryKey: 'executionType',
                parameterType: 'ExecutionTypeParameter',
                defaultValue: {
                  apiValue: 'aggregation',
                  displayValue: 'Aggregation',
                },
                availableValues: [
                  {
                    apiValue: 'aggregation',
                    displayValue: 'Aggregation',
                  },
                  {
                    apiValue: 'timeseries',
                    displayValue: 'Time Series',
                  },
                ],
              },
              {
                queryKey: 'endTime',
                parameterType: 'EndDateParameter',
              },
              {
                queryKey: 'flexSearch',
                parameterType: 'FlexSearchParameter',
                defaultValue: {
                  apiValue: null,
                  displayValue: null,
                },
              },
              {
                queryKey: 'interface',
                parameterType: 'DeviceInterfaceParameter',
              },
              {
                queryKey: 'startTime',
                parameterType: 'StartDateParameter',
              },
              {
                queryKey: 'sortBy',
                parameterType: 'TotalDataSortByParameter',
                defaultValue: {
                  apiValue: 'BYTE',
                  displayValue: 'Bytes',
                },
                availableValues: [
                  {
                    apiValue: 'BIT_RATE',
                    displayValue: 'Bit Rate',
                  },
                  {
                    apiValue: 'BYTE',
                    displayValue: 'Bytes',
                  },
                  {
                    apiValue: 'PACKET_RATE',
                    displayValue: 'Packet Rate',
                  },
                  {
                    apiValue: 'PACKET',
                    displayValue: 'Packets',
                  },
                  {
                    apiValue: 'FLOW',
                    displayValue: 'Flow',
                  },
                ],
              },
              {
                queryKey: 'direction',
                parameterType: 'FlowDirectionParameter',
                defaultValue: {
                  apiValue: 'outbound',
                  displayValue: 'Outbound',
                },
                availableValues: [
                  {
                    apiValue: 'inbound',
                    displayValue: 'Inbound',
                  },
                  {
                    apiValue: 'outbound',
                    displayValue: 'Outbound',
                  },
                  {
                    apiValue: 'both',
                    displayValue: 'Inbound and Outbound Combined',
                  },
                ],
              },
            ],
          },
          parameters: {
            deviceSerial: 'ALL_WAN_DEVICES',
            executionType: ReportExecutionTypeParameter.AGGREGATION,
            endTime: '1587058866385',
            flexSearch: null,
            interface: 'All Interfaces',
            startTime: '1587057966385',
            sortBy: ReportSortByParameter.BYTES,
            direction: ReportDirectionParameter.OUTBOUND,
          },
          results: [
            {
              state: ReportResultState.SUCCESS,
              reportKeys: [
                {
                  href: 'https://10.2.101.102:8093/v1/infoElements/0',
                  id: '0',
                  fieldId: '0',
                  name: 'application',
                  infoElementType: InfoElementType.STRING,
                  defaultLabel: 'Application',
                  label: 'Application',
                },
              ],
              summary: {
                chartField: {
                  href: 'https://10.2.101.102:8093/v1/infoElements/2',
                  id: '2',
                  fieldId: '2',
                  name: 'total_bytes',
                  infoElementType: InfoElementType.LONG,
                  defaultLabel: 'Total Bytes',
                  label: 'Total Bytes',
                  units: 'bytes',
                },
                fields: [
                  {
                    href: 'https://10.2.101.102:8093/v1/infoElements/0',
                    id: '0',
                    fieldId: '0',
                    name: 'application',
                    infoElementType: InfoElementType.STRING,
                    defaultLabel: 'Application',
                    label: 'Application',
                  },
                  {
                    href: 'https://10.2.101.102:8093/v1/infoElements/1',
                    id: '1',
                    fieldId: '1',
                    name: 'total_flows',
                    infoElementType: InfoElementType.LONG,
                    defaultLabel: 'Total Flows',
                    label: 'Total Flows',
                  },
                  {
                    href: 'https://10.2.101.102:8093/v1/infoElements/2',
                    id: '2',
                    fieldId: '2',
                    name: 'total_bytes',
                    infoElementType: InfoElementType.LONG,
                    defaultLabel: 'Total Bytes',
                    label: 'Total Bytes',
                    units: 'bytes',
                  },
                  {
                    href: 'https://10.2.101.102:8093/v1/infoElements/3',
                    id: '3',
                    fieldId: '3',
                    name: 'total_packets',
                    infoElementType: InfoElementType.LONG,
                    defaultLabel: 'Total Packets',
                    label: 'Total Packets',
                  },
                  {
                    href: 'https://10.2.101.102:8093/v1/infoElements/4',
                    id: '4',
                    fieldId: '4',
                    name: 'average_bps',
                    infoElementType: InfoElementType.DOUBLE,
                    defaultLabel: 'Average Bit Rate',
                    label: 'Average Bit Rate',
                    units: 'bps',
                  },
                  {
                    href: 'https://10.2.101.102:8093/v1/infoElements/5',
                    id: '5',
                    fieldId: '5',
                    name: 'average_pps',
                    infoElementType: InfoElementType.DOUBLE,
                    defaultLabel: 'Average Packet Rate',
                    label: 'Average Packet Rate',
                    units: 'pps',
                  },
                ],
                summaryData: [
                  {
                    key: [
                      {
                        infoElementId: '0',
                        value: 'http',
                      },
                    ],
                    data: [
                      {
                        infoElementId: '0',
                        value: 'http',
                      },
                      {
                        infoElementId: '1',
                        value: 2,
                      },
                      {
                        infoElementId: '2',
                        value: 108907852,
                      },
                      {
                        infoElementId: '3',
                        value: 77800,
                      },
                      {
                        infoElementId: '4',
                        value: 968069.7955555556,
                      },
                      {
                        infoElementId: '5',
                        value: 86.44444444444444,
                      },
                    ],
                  },
                  {
                    key: [
                      {
                        infoElementId: '0',
                        value: 'gre',
                      },
                    ],
                    data: [
                      {
                        infoElementId: '0',
                        value: 'gre',
                      },
                      {
                        infoElementId: '1',
                        value: 6,
                      },
                      {
                        infoElementId: '2',
                        value: 515708,
                      },
                      {
                        infoElementId: '3',
                        value: 4943,
                      },
                      {
                        infoElementId: '4',
                        value: 4584.071111111111,
                      },
                      {
                        infoElementId: '5',
                        value: 5.492222222222222,
                      },
                    ],
                  },
                  {
                    key: [
                      {
                        infoElementId: '0',
                        value: 'rtp-audio',
                      },
                    ],
                    data: [
                      {
                        infoElementId: '0',
                        value: 'rtp-audio',
                      },
                      {
                        infoElementId: '1',
                        value: 6,
                      },
                      {
                        infoElementId: '2',
                        value: 454560,
                      },
                      {
                        infoElementId: '3',
                        value: 5682,
                      },
                      {
                        infoElementId: '4',
                        value: 4040.5333333333333,
                      },
                      {
                        infoElementId: '5',
                        value: 6.3133333333333335,
                      },
                    ],
                  },
                  {
                    key: [
                      {
                        infoElementId: '0',
                        value: 'netflow',
                      },
                    ],
                    data: [
                      {
                        infoElementId: '0',
                        value: 'netflow',
                      },
                      {
                        infoElementId: '1',
                        value: 2,
                      },
                      {
                        infoElementId: '2',
                        value: 1568,
                      },
                      {
                        infoElementId: '3',
                        value: 6,
                      },
                      {
                        infoElementId: '4',
                        value: 13.937777777777777,
                      },
                      {
                        infoElementId: '5',
                        value: 0.006666666666666667,
                      },
                    ],
                  },
                  {
                    key: [
                      {
                        infoElementId: '0',
                        value: 'ftp',
                      },
                    ],
                    data: [
                      {
                        infoElementId: '0',
                        value: 'ftp',
                      },
                      {
                        infoElementId: '1',
                        value: 1,
                      },
                      {
                        infoElementId: '2',
                        value: 985,
                      },
                      {
                        infoElementId: '3',
                        value: 12,
                      },
                      {
                        infoElementId: '4',
                        value: 8.755555555555556,
                      },
                      {
                        infoElementId: '5',
                        value: 0.013333333333333334,
                      },
                    ],
                  },
                ],
              },
              metadata: [
                {
                  field: ReportResultMetadataType.GENERIC,
                  value: {
                    field: 'Server Name',
                    value: 'Justin Ho\'s Server',
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  }
}

/**
 * This mock container simulates a panel which has a group of widgets on them.
 */
@Component({
  selector: 'nx-mock-widget-page-container',
  template: `
    <nx-dashboard-widget-container
      widgetId="mock-widget-container"
      [reportRequest]="reportRequest"
      [visualComponent]="visualComponent"
    ></nx-dashboard-widget-container>
  `,
  providers: [
    {
      provide: WidgetDataProvider,
      useExisting: ReportWidgetDataProviderService,
    },
  ],
})
  // @ts-ignore
class MockWidgetPageContainer {
  visualComponent = DashboardWidgetTableComponent;
  reportRequest = {};
}

export default {
  title: 'Dashboard/DasbhoardWidgetContainer',

  decorators: [
    moduleMetadata({
      imports: [CommonModule, SharedModule, GridModule, LoggerTestingModule],
      declarations: [
        DashboardWidgetComponent,
        WidgetVisualDirective,
        DashboardWidgetTableComponent,
        DashboardWidgetVisualComponent,
        DashboardWidgetContainer,
        MockWidgetPageContainer,
      ],
      providers: [{ provide: ReportService, useClass: MockReportService }],
      entryComponents: [DashboardWidgetTableComponent],
    }),
  ],
};

export const Default = () => {
  return {
    template: `<nx-mock-widget-page-container></nx-mock-widget-page-container>`,
  };
};

Default.story = {
  name: 'default',
};
