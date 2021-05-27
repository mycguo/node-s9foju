import {getTestBed, TestBed} from '@angular/core/testing';
import {LiveInsightReportService} from './live-insight-report.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityState, EntityStore} from '@datorama/akita';
import {CookieService} from 'ngx-cookie-service';
import {LiveInsightEdgeReportChartObject} from './live-insight-edge-report-chart-object';
import {TimeSeriesTooltipProvider} from '../../../../shared/components/charts/time-series-chart/time-series-tooltip-provider';
import {LoggerTestingModule} from '../../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeReportService', () => {
  let injector: TestBed;
  let service: LiveInsightReportService;
  let httpMock: HttpTestingController;

  let storeSpy: EntityStore<EntityState<LiveInsightEdgeReportChartObject>>;
  beforeEach(() => {
    storeSpy = new EntityStore<EntityState<LiveInsightEdgeReportChartObject>>(
      void 0,
      {name: LiveInsightReportService.STORE_NAME}
    );
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: EntityStore, useValue: storeSpy},
        CookieService,
        TimeSeriesTooltipProvider
      ]
    });
    injector = getTestBed();
    service = injector.get(LiveInsightReportService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  // describe('getReports', () => {
  //   const apiMockResponse: { reports: Array<ReportRequest> } = {
  //     reports: [{
  //       reportId: {
  //         id: 8,
  //         category: ReportCategoryParameter.FLOW
  //       },
  //       parameters: {
  //         startTime: 1,
  //         endTime: 5,
  //         flexSearch: 'wan'
  //       }
  //     }]
  //   };
  //
  //
  //   it('generates entities that include id properly', (done) => {
  //     const params: LiveInsightEdgeReportParameters = {
  //       isAnomaliesOnly: true,
  //       flexFilter: '',
  //       timeSortOrder: SortOrder.ASCENDING,
  //       volumeSortOrder: SortOrder.ASCENDING,
  //       endTimeMillis: 0,
  //       startTimeMillis: 1000
  //     };
  //     spyOn(storeSpy, 'setLoading').and.callThrough();
  //     service.getReports(params).subscribe(data => {
  //       expect(data).toBeDefined();
  //       expect(data[0].id).toBeDefined();
  //       expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
  //       done();
  //     });
  //     const req = httpMock.expectOne(LiveInsightReportDataService.INSIGHT_REPORT_ENDPOINT);
  //     expect(req.request.method).toEqual('POST');
  //     req.flush(apiMockResponse);
  //
  //     // Device serial request inside getReports
  //     const deviceRequest = httpMock.expectOne(DeviceFormatterService.DEVICE_SEARCH_UNAUTH_PROXY_ENDPOINT);
  //     expect(deviceRequest.request.method).toEqual('POST');
  //     deviceRequest.flush({devices: []});
  //
  //     // Execute report request inside getReports
  //     const reportReq = httpMock.expectOne(ReportService.REPORT_QUEUE_ENDPOINT);
  //     expect(reportReq.request.method).toEqual('POST');
  //     reportReq.flush(apiMockResponse);
  //   });
  // });
});
