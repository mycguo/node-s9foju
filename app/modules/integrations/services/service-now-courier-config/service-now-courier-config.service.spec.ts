import {TestBed} from '@angular/core/testing';

import {ServiceNowCourierConfigService} from './service-now-courier-config.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CommonService} from '../../../../utils/common/common.service';
import {EntityStore} from '@datorama/akita';
import {ServiceNowCourierConfigsState} from './models/service-now-courier-configs-state';
import ServiceNowCourierConfig from './models/service-now-courier-config';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ServiceNowCourierConfigService', () => {
  let service: ServiceNowCourierConfigService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<ServiceNowCourierConfigsState>;

  beforeEach(() => {
    storeSpy = new EntityStore<ServiceNowCourierConfigsState>(ServiceNowCourierConfigService.INITIAL_STATE,
      {name: ServiceNowCourierConfigService.STORE_NAME});
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CommonService,
        {provide: EntityStore, useValue: storeSpy}
      ]
    });
    service = TestBed.inject(ServiceNowCourierConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConfigCouriers', () => {
    it('should call the api and store the result', (done) => {
      const fixture: Array<ServiceNowCourierConfig> = [
        {fieldName: 'a', value: 'a'},
        {fieldName: 'b', value: 'b'}
      ];
      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setActive').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getConfigCouriers().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(fixture);
        done();
      });
      const req = httpMock.expectOne(ServiceNowCourierConfigService.SERVICE_NOW_COURIER_CONFIG_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({fieldOptions: fixture});
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(fixture));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(3);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      const detailedError = {
        message: 'Http failure response for /api/nx/serviceNow/global/courierConfig : 500 Server Error'
      };
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();

      service.getConfigCouriers()
        .subscribe((data) => {
            expect(data).not.toBeDefined();
            done();
          },
          (err) => {
            expect(err).toBeDefined();
            expect(err).toEqual(jasmine.objectContaining(detailedError));
            done();
          });
      const req = httpMock.expectOne(ServiceNowCourierConfigService.SERVICE_NOW_COURIER_CONFIG_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(detailedError));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(3);
    });
  });

  describe('updateConfigCouriers', () => {
    it('should call the update api and store the result', (done) => {
      const fixture: Array<ServiceNowCourierConfig> = [
        {fieldName: 'a', value: 'a'},
        {fieldName: 'b', value: 'b'}
      ];
      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setActive').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.updateConfigCouriers(fixture).subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(fixture);
        done();
      });
      const req = httpMock.expectOne(ServiceNowCourierConfigService.SERVICE_NOW_COURIER_CONFIG_URL);
      expect(req.request.method).toEqual('PUT');
      req.flush({fieldOptions: fixture});
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(fixture));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(3);
    });
  });
});
