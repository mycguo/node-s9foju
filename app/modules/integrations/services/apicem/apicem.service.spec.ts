import {getTestBed, TestBed} from '@angular/core/testing';
import {ApicemService} from './apicem.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import IIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IIntegrationsValidate';
import IIntegrationsParams from '../../../../../../../project_typings/api/integrations/IIntegrationsParams';
import IIntegrations from '../../../../../../../project_typings/api/integrations/IIntegrations';
import {of} from 'rxjs';
import {Store} from '@datorama/akita';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';


describe('ApicemService', () => {
  let injector: TestBed;
  let service: ApicemService;
  let httpMock: HttpTestingController;
  let apicemStoreSpy: Store<IIntegrationsValidate>;

  beforeEach(() => {
    apicemStoreSpy = new Store<IIntegrationsValidate>(ApicemService.INITIAL_STATE, {name: ApicemService.STORE_NAME});
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: Store, useValue: apicemStoreSpy}
      ]
    });
    injector = getTestBed();
    service = injector.get(ApicemService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getApicem$', () => {
    const validGetResponse: IIntegrationsValidate = {
      config: {hostname: 'hostname', username: 'username'},
      provided: false,
      status: ConfigurationEnum.VALID,
      statusMessage: 'message'
    };

    it('should call api and store the result', (done) => {
      spyOn(apicemStoreSpy, 'update').and.callThrough();
      spyOn(apicemStoreSpy, 'setLoading').and.callThrough();
      service.getApicem().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(validGetResponse);
        done();
      });
      const req = httpMock.expectOne(ApicemService.APICEM_CONFIG_URL);
      expect(req.request.method).toEqual('GET');
      req.flush(validGetResponse);
      expect(apicemStoreSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(validGetResponse));
      expect(apicemStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(apicemStoreSpy, 'setError').and.callThrough();
      spyOn(apicemStoreSpy, 'setLoading').and.callThrough();
      service.getApicem().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(ApicemService.APICEM_CONFIG_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
      expect(apicemStoreSpy.setError).toHaveBeenCalled();
      expect(apicemStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateApicem$', () => {
    const rtnResponse: IIntegrations = {
      hostname: 'hostname',
      username: 'username'
    };
    it('should call the PUT API request', (done) => {
      spyOn(service, 'getApicem').and.callFake(() => of());
      const params: IIntegrationsParams = {
        hostname: 'hostname',
        username: 'username',
        password: 'password'
      };
      service.updateApicem(params).subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(rtnResponse);
        done();
      });
      const req = httpMock.expectOne(ApicemService.APICEM_CONFIG_URL);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(params);
      req.flush(rtnResponse);
    });

    it('should handle error if PUT API request errors', (done) => {
      spyOn(service, 'getApicem').and.callThrough();
      spyOn(apicemStoreSpy, 'setLoading').and.callThrough();
      const error = {status: 500, statusText: 'Server Error'};
      const params: IIntegrationsParams = {
        hostname: 'hostname',
        username: 'username',
        password: 'password'
      };
      service.updateApicem(params).subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(service.getApicem).not.toHaveBeenCalled();
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          expect(apicemStoreSpy.setLoading).toHaveBeenCalledTimes(2);
          done();
        });
      const req = httpMock.expectOne(ApicemService.APICEM_CONFIG_URL);
      req.flush({}, error);
    });
  });

  describe('deleteApicem$', () => {
    const rtnResponse: IIntegrations = {
      hostname: '',
      username: ''
    };
    it('should call the DELETE API request', (done) => {
      spyOn(service, 'getApicem').and.callFake(() => of());
      service.deleteApicem().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(rtnResponse);
        done();
      });
      const req = httpMock.expectOne(ApicemService.APICEM_CONFIG_URL);
      expect(req.request.method).toEqual('DELETE');
      req.flush(rtnResponse);
    });

    it('should handle error if DELETE API request errors', (done) => {
      spyOn(service, 'getApicem').and.callThrough();
      spyOn(apicemStoreSpy, 'setLoading').and.callThrough();
      const error = {status: 500, statusText: 'Server Error'};

      service.deleteApicem().subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(service.getApicem).not.toHaveBeenCalled();
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          expect(apicemStoreSpy.setLoading).toHaveBeenCalledTimes(2);
          done();
        });
      const req = httpMock.expectOne(ApicemService.APICEM_CONFIG_URL);
      req.flush({}, error);
    });
  });
});
