import {getTestBed, TestBed} from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import IServiceNowIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IServiceNowIntegrationsValidate';
import {SERVICE_NOW_INTEGRATION_TYPE} from '../../../../../../../project_typings/enums/serviceNowIntegrationTypeEnum';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import IServiceNowIntegration from '../../../../../../../project_typings/api/integrations/IServiceNowIntegration';
import IServiceNowIntegrationsParams from '../../../../../../../project_typings/api/integrations/IServiceNowIntegrationsParams';
import {of} from 'rxjs';
import {Store} from '@datorama/akita';
import {ApicemService} from '../apicem/apicem.service';
import {ServiceNowStoreState} from './service-now-store-state';
import {ServiceNowService} from './service-now.service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ServiceNowService', () => {
  let injector: TestBed;
  let service: ServiceNowService;
  let httpMock: HttpTestingController;
  let serviceNowStoreSpy: Store<ServiceNowStoreState>;

  beforeEach(() => {
    serviceNowStoreSpy = new Store<ServiceNowStoreState>(ServiceNowService.INITIAL_STATE, {name: ApicemService.STORE_NAME});

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: Store, useValue: serviceNowStoreSpy}
      ]
    });
    injector = getTestBed();
    service = injector.get(ServiceNowService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getServiceNow$', () => {
    const validGetResponse: IServiceNowIntegrationsValidate = {
      config: {
        hostname: 'hostname',
        username: 'username',
        integrationType: SERVICE_NOW_INTEGRATION_TYPE.event_management_plugin
      },
      provided: false,
      status: ConfigurationEnum.VALID,
      statusMessage: 'message'
    };

    it('should call api and store the result', (done) => {
      spyOn(serviceNowStoreSpy, 'update').and.callThrough();
      spyOn(serviceNowStoreSpy, 'setLoading').and.callThrough();
      service.getServiceNow().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(validGetResponse);
        done();
      });
      const req = httpMock.expectOne(`${ServiceNowService.SERVICE_NOW_CONFIG_URL}/validate`);
      expect(req.request.method).toEqual('POST');
      req.flush(validGetResponse);
      expect(serviceNowStoreSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(validGetResponse));
      expect(serviceNowStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      const detailedError = {
        message: 'Http failure response for /api/nx/serviceNow/config/validate: 500 Server Error'
      };
      spyOn(serviceNowStoreSpy, 'setError').and.callThrough();
      spyOn(serviceNowStoreSpy, 'setLoading').and.callThrough();
      service.getServiceNow().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(detailedError));
          done();
        });
      const req = httpMock.expectOne(`${ServiceNowService.SERVICE_NOW_CONFIG_URL}/validate`);
      expect(req.request.method).toEqual('POST');
      req.flush({}, {status: 500, statusText: 'Server Error'});
      expect(serviceNowStoreSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(detailedError));
      expect(serviceNowStoreSpy.setLoading).toHaveBeenCalledTimes(3);
    });
  });

  describe('updateServiceNow$', () => {
    beforeEach(() => {
      spyOn(service, 'getServiceNow').and.callFake(() => of());
    });

    const params: IServiceNowIntegrationsParams = {
      hostname: 'hostname',
      username: 'username',
      password: 'password',
      integrationType: SERVICE_NOW_INTEGRATION_TYPE.event_management_plugin
    };

    it('should call the PUT API request', (done) => {
      const rtnResponse: IServiceNowIntegration = {
        hostname: 'hostname',
        username: 'username',
        integrationType: SERVICE_NOW_INTEGRATION_TYPE.event_management_plugin
      };
      service.updateServiceNow(params).subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(rtnResponse);
        done();
      });
      const req = httpMock.expectOne(ServiceNowService.SERVICE_NOW_CONFIG_URL);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(params);
      req.flush(rtnResponse);
    });

    it('should handle error if PUT API request errors', (done) => {
      spyOn(serviceNowStoreSpy, 'setError').and.callThrough();
      const error = {status: 500, statusText: 'Server Error'};
      service.updateServiceNow(params).subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(service.getServiceNow).not.toHaveBeenCalled();
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(ServiceNowService.SERVICE_NOW_CONFIG_URL);
      req.flush({}, error);
    });
  });

  describe('deleteServiceNow$', () => {
    beforeEach(() => {
      spyOn(service, 'getServiceNow').and.callFake(() => of());
    });

    it('should call the DELETE API request', (done) => {
      const rtnResponse: IServiceNowIntegration = {
        hostname: '',
        username: '',
        integrationType: void 0
      };
      service.deleteServiceNow().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(rtnResponse);
        done();
      });
      const req = httpMock.expectOne(ServiceNowService.SERVICE_NOW_CONFIG_URL);
      expect(req.request.method).toEqual('DELETE');
      req.flush(rtnResponse);
    });

    it('should handle error if DELETE API request errors', (done) => {
      spyOn(serviceNowStoreSpy, 'setError').and.callThrough();
      const error = {status: 500, statusText: 'Server Error'};

      service.deleteServiceNow().subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(service.getServiceNow).not.toHaveBeenCalled();
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(ServiceNowService.SERVICE_NOW_CONFIG_URL);
      req.flush({}, error);
    });
  });
});
