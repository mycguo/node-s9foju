import { FlowReportsResultsLimitService } from './flow-reports-results-limit.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Query, Store } from '@datorama/akita';
import { TestBed } from '@angular/core/testing';
import { FlowReportsResultsLimit } from './flow-reports-results-limit';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('FlowReportsResultLimitService', () => {
  const REPORT_LIMIT_RESPONSE = {maxReturnSize: 100500};
  const ERROR_RESPONSE = {status: 500, statusText: 'Server Error'};

  let service: FlowReportsResultsLimitService;
  let httpMock: HttpTestingController;
  let storeSpy: Store<FlowReportsResultsLimit>;
  let querySpy: Query<FlowReportsResultsLimit>;

  beforeEach(() => {
    storeSpy = FlowReportsResultsLimitService.flowReportsResultsLimitStore;
    querySpy = FlowReportsResultsLimitService.flowReportsResultsLimitQuery;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
      ]
    });
    service = TestBed.inject(FlowReportsResultsLimitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    storeSpy.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReportsLimit', () => {
    it('should return reports limit value and set the store', (done) => {
      spyOn(storeSpy, 'setLoading').and.callThrough();
      spyOn(storeSpy, 'update').and.callThrough();

      service.getReportsLimit()
        .subscribe(resp => {
          expect(resp).toBeDefined();
          expect(resp).toEqual(REPORT_LIMIT_RESPONSE);
          done();
        });

      const req = httpMock.expectOne(FlowReportsResultsLimitService.FLOW_REPORTS_RESULTS_LIMIT_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush(REPORT_LIMIT_RESPONSE);

      expect(storeSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(REPORT_LIMIT_RESPONSE));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      spyOn(storeSpy, 'setLoading').and.callThrough();
      spyOn(storeSpy, 'setError').and.callThrough();

      service.getReportsLimit()
        .subscribe(resp => {
          expect(resp).not.toBeDefined();
          done();
        }, err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(ERROR_RESPONSE));
          done();
        });

      const req = httpMock.expectOne(FlowReportsResultsLimitService.FLOW_REPORTS_RESULTS_LIMIT_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush({}, ERROR_RESPONSE);

      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(ERROR_RESPONSE));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

});
