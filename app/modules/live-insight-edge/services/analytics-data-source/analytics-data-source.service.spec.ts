import { TestBed } from '@angular/core/testing';

import { AnalyticsDataSourceService } from './analytics-data-source.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Query, Store} from '@datorama/akita';
import {of} from 'rxjs';
import AnalyticsDataSourceState from './analytics-data-source.state';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

const MOCK_ANALYTICS_DATA_SOURCE: AnalyticsDataSourceState = {
  wan: true,
  xcon: false,
  interfaceTags: ['tag1'],
  serviceProviders: ['SP1']
};

describe('AnalyticsDataSourceService', () => {
  let service: AnalyticsDataSourceService;
  let httpMock: HttpTestingController;
  let storeSpy: Store<AnalyticsDataSourceState>;
  let querySpy: Query<AnalyticsDataSourceState>;

  beforeEach(() => {
    storeSpy = AnalyticsDataSourceService.store;
    querySpy = AnalyticsDataSourceService.query;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
      ]
    });
    service = TestBed.inject(AnalyticsDataSourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectState', () => {
    it('should call select on the query', (done) => {
      spyOn(querySpy, 'select').and.returnValue(of(MOCK_ANALYTICS_DATA_SOURCE));
      service.selectState()
        .subscribe((response) => {
          expect(response).toBeDefined();
          expect(response).toEqual(jasmine.objectContaining(MOCK_ANALYTICS_DATA_SOURCE));
          expect(querySpy.select).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('selectLoading', () => {
    it('should call selectLoading on the query', (done) => {
      spyOn(querySpy, 'selectLoading').and.returnValue(of(false));
      service.selectLoading()
        .subscribe((isLoading: boolean) => {
          expect(isLoading).toBeFalsy();
          expect(querySpy.selectLoading).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('selectError', () => {
    it('should call selectError on the query', (done) => {
      spyOn(querySpy, 'selectError').and.returnValue(of(void 0));
      service.selectError()
        .subscribe((error: Error) => {
          expect(error).toBeUndefined();
          expect(querySpy.selectError).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('getAnalyticsDataSource', () => {
    it('should return analytics data and set the store', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getAnalyticsDataSource()
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(MOCK_ANALYTICS_DATA_SOURCE);
          done();
        });

      const req = httpMock.expectOne(AnalyticsDataSourceService.ANALYTICS_DATA_SOURCE_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush(MOCK_ANALYTICS_DATA_SOURCE);
      expect(storeSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(MOCK_ANALYTICS_DATA_SOURCE));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getAnalyticsDataSource().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(AnalyticsDataSourceService.ANALYTICS_DATA_SOURCE_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush({}, {status: 500, statusText: 'Server Error'});
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('setAnalyticsDataSource', () => {
    it('should set analytics data and set the store', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.setAnalyticsDataSource(MOCK_ANALYTICS_DATA_SOURCE)
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(MOCK_ANALYTICS_DATA_SOURCE);
          done();
        });

      const req = httpMock.expectOne(AnalyticsDataSourceService.ANALYTICS_DATA_SOURCE_ENDPOINT);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toBeTruthy();
      req.flush(MOCK_ANALYTICS_DATA_SOURCE);
      expect(storeSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(MOCK_ANALYTICS_DATA_SOURCE));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.setAnalyticsDataSource(MOCK_ANALYTICS_DATA_SOURCE).subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(AnalyticsDataSourceService.ANALYTICS_DATA_SOURCE_ENDPOINT);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toBeTruthy();
      req.flush({}, {status: 500, statusText: 'Server Error'});
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
