import {ReportsManagement} from './models/reports-management';
import {ReportOwnerStatus} from './enums/report-owner-status.enum';
import {ReportsManagementResponse} from './models/reports-management-response';
import ExecutionTypeEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/executionTypeEnums';
import ReportCategoryEnum from '../../../../../../../client/nxComponents/services/laSavedReports/reportCategoryEnum';
import SortByEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/SortByEnum';
import DirectionEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/directionEnum';
import FlowTypeEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/flowTypeEnum';
import ReportPresentationModeEnum from '../../../../../../../project_typings/api/reportTemplate/ReportRequest/enums/reportPresentationModeEnum';

export default class ReportsManagementServiceFixtures {
  static REPORTS_LIST_MOCK: ReportsManagement[] = [
    new ReportsManagement(
      {
        id: '6792a35a-eefa-4920-9efe-abeb44b3da92',
        reportName: 'Application',
        isScheduled: false,
        reportOwner: 'user33',
        reportOwnerStatus: ReportOwnerStatus.ACTIVE
      }
    ),
    new ReportsManagement(
      {
        id: '3f8e3b5d-816b-487f-a56e-7780e82d2173',
        reportName: 'Interface Utilization Above Threshold Over Time, Last Week',
        isScheduled: false,
        reportOwner: 'admin',
        reportOwnerStatus: ReportOwnerStatus.ACTIVE
      }
    ),
    new ReportsManagement(
      {
        id: '8b4d3a9e-3e54-4b7c-8983-3c715827541b',
        reportName: 'Top Conversations',
        isScheduled: true,
        reportOwner: 'fullconfig',
        reportOwnerStatus: ReportOwnerStatus.ACTIVE
      }
    ),
    new ReportsManagement(
      {
        id: 'ccc2a021-de94-4623-885a-7a2e1bdd3740',
        reportName: 'Top Interface Bandwidths',
        isScheduled: true,
        reportOwner: 'fullconf',
        reportOwnerStatus: ReportOwnerStatus.ACTIVE
      }
    ),
    new ReportsManagement(
      {
        id: '579eaf2b-8838-4d4e-a3bc-d3011e107585',
        reportName: 'Interface Utilization Under Threshold Over Time, Last Week',
        isScheduled: false,
        reportOwner: 'User5',
        reportOwnerStatus: ReportOwnerStatus.REMOVED
      }
    )
  ];

  static SCHEDULED_REPORTS_RESPONSE: {meta: Object, groups: ReportsManagementResponse[]} = {
    meta: {
      href: 'https://127.0.0.1:8093/v1/reports/alltemplates/',
      http: {
        method: 'GET',
        statusCode: 200,
        statusReason: 'OK'
      }
    },
    groups: [
      {
        id: '6792a35a-eefa-4920-9efe-abeb44b3da92',
        name: 'Application',
        resultUrl: 'http://localhost:9000/shared',
        sharingConfig: [],
        reports: [
          {
            reportId: {
              category: ReportCategoryEnum.FLOW,
              id: '8'
            },
            parameters: {
              deviceSerial: 'ALL_WAN_DEVICES',
              displayFilter: 'No Display Filtering',
              executionType: ExecutionTypeEnum.TIME_SERIES,
              businessHours: 'none',
              binDuration: 'auto',
              startTime: 1600147052166,
              sortBy: SortByEnum.BIT_RATE,
              endTime: 1600751852166,
              interface: 'All Interfaces',
              direction: DirectionEnum.OUTBOUND,
              flowType: FlowTypeEnum.BASIC
            },
            reportName: 'Top Application As Template',
            reportDescription: null
          }
        ],
        scheduleConfig: null,
        visibility: 'private',
        owner: 'user33',
        clientTimeParameters: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true
          },
          relativeQueryTime: 900,
          startTimeInMillis: 0,
          endTimeInMillis: 0,
          customTime: false
        },
        globalReportParameters: {
          flexSearch: '',
          displayFilter: ''
        },
        reportFootNote: '',
        presentationMode: ReportPresentationModeEnum.STANDARD,
        logo: {
          id: null
        }
      },
      {
        id: '3f8e3b5d-816b-487f-a56e-7780e82d2173',
        name: 'Interface Utilization Above Threshold Over Time, Last Week',
        resultUrl: 'http://localhost:9000/shared',
        sharingConfig: [],
        reports: [
          {
            reportId: {
              category: ReportCategoryEnum.QOS,
              id: '56'
            },
            parameters: {
              deviceSerial: 'ALL_WAN_DEVICES',
              interfaceUtilizationThreshold: 95,
              executionType: ExecutionTypeEnum.AGGREGATION,
              businessHours: 'none',
              utilizationAboveThresholdDurationInHours: 2,
              binDuration: '5min',
              startTime: 1599840050308,
              endTime: 1600444850308,
              interface: 'All Interfaces',
              direction: DirectionEnum.SEPARATED
            },
            reportName: null,
            reportDescription: null
          }
        ],
        scheduleConfig: null,
        visibility: 'private',
        owner: 'admin',
        clientTimeParameters: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true
          },
          relativeQueryTime: 604800,
          startTimeInMillis: 0,
          endTimeInMillis: 0,
          customTime: false
        },
        globalReportParameters: {
          flexSearch: '',
          displayFilter: ''
        },
        reportFootNote: '',
        presentationMode: ReportPresentationModeEnum.STANDARD,
        logo: {
          id: null
        }
      },
      {
        id: '8b4d3a9e-3e54-4b7c-8983-3c715827541b',
        name: 'Top Conversations',
        resultUrl: 'http://localhost:9000/shared',
        sharingConfig: [],
        reports: [
          {
            reportId: {
              category: ReportCategoryEnum.FLOW,
              id: '5'
            },
            parameters: {
              displayFilter: 'No Display Filtering',
              executionType: ExecutionTypeEnum.TIME_SERIES,
              businessHours: 'none',
              binDuration: 'auto',
              interface: 'All Interfaces',
              shouldWaitForDnsResolution: false,
              deviceSerial: 'ALL_WAN_DEVICES',
              startTime: 1599839608696,
              sortBy: SortByEnum.BIT_RATE,
              endTime: 1600444408696,
              direction: DirectionEnum.OUTBOUND,
              flowType: FlowTypeEnum.MEDIANET
            },
            reportName: 'Top Conversation Media Net Flow',
            reportDescription: null
          }
        ],
        scheduleConfig: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true,
            supportsDst: true,
            standardOffset: -28800
          },
          frequencies: [
            {
              type: 'daily',
              interval: {
                startTime: '08:54',
                endTime: '08:54'
              }
            }
          ],
          endBy: null
        },
        visibility: 'private',
        owner: 'fullconfig',
        clientTimeParameters: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true
          },
          relativeQueryTime: 900,
          startTimeInMillis: 0,
          endTimeInMillis: 0,
          customTime: false
        },
        globalReportParameters: {
          flexSearch: '',
          displayFilter: ''
        },
        reportFootNote: '',
        presentationMode: ReportPresentationModeEnum.STANDARD,
        logo: {
          id: null
        }
      },
      {
        id: 'ccc2a021-de94-4623-885a-7a2e1bdd3740',
        name: 'Top Interface Bandwidths',
        resultUrl: 'http://localhost:9000/shared',
        sharingConfig: [],
        reports: [
          {
            reportId: {
              category: ReportCategoryEnum.QOS,
              id: '7'
            },
            parameters: {
              deviceSerial: 'ALL_DEVICES_SERIAL',
              executionType: ExecutionTypeEnum.AGGREGATION,
              businessHours: 'none',
              startTime: 1599839745799,
              endTime: 1600444545799,
              direction: DirectionEnum.SEPARATED
            },
            reportName: 'Top Interface Bandwidth',
            reportDescription: null
          }
        ],
        scheduleConfig: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true,
            supportsDst: true,
            standardOffset: -28800
          },
          frequencies: [
            {
              type: 'daily',
              interval: {
                startTime: '08:56',
                endTime: '08:56'
              }
            }
          ],
          endBy: null
        },
        visibility: 'private',
        owner: 'fullconf',
        clientTimeParameters: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true
          },
          relativeQueryTime: 900,
          startTimeInMillis: 0,
          endTimeInMillis: 0,
          customTime: false
        },
        globalReportParameters: {
          flexSearch: '',
          displayFilter: ''
        },
        reportFootNote: '',
        presentationMode: ReportPresentationModeEnum.STANDARD,
        logo: {
          id: null
        }
      },
      {
        id: '579eaf2b-8838-4d4e-a3bc-d3011e107585',
        name: 'Interface Utilization Under Threshold Over Time, Last Week',
        resultUrl: 'http://localhost:9000/shared',
        sharingConfig: [],
        reports: [
          {
            reportId: {
              category: ReportCategoryEnum.QOS,
              id: '57'
            },
            parameters: {
              deviceSerial: 'ALL_WAN_DEVICES',
              interfaceUtilizationThreshold: 10,
              utilizationUnderThresholdDurationInHours: 2,
              executionType: ExecutionTypeEnum.AGGREGATION,
              businessHours: 'none',
              binDuration: '5min',
              startTime: 1599840214277,
              endTime: 1600445014277,
              interface: 'All Interfaces',
              direction: DirectionEnum.SEPARATED
            },
            reportName: null,
            reportDescription: null
          }
        ],
        scheduleConfig: null,
        visibility: 'private',
        owner: 'User5',
        clientTimeParameters: {
          timeZone: {
            id: 'America/Los_Angeles',
            enableDst: true
          },
          relativeQueryTime: 604800,
          startTimeInMillis: 0,
          endTimeInMillis: 0,
          customTime: false
        },
        globalReportParameters: {
          flexSearch: '',
          displayFilter: ''
        },
        reportFootNote: '',
        presentationMode: ReportPresentationModeEnum.STANDARD,
        logo: {
          id: null
        }
      }
    ]
  };

  static ERROR_RESPONSE = {status: 500, statusText: 'Server Error'};
}
