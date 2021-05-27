import {getTestBed, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SdwanService} from './sdwan.service';
import {Store} from '@datorama/akita';
import {CommonService} from '../../../../utils/common/common.service';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import IntegrationSdwanForm from '../../components/sdwan-form/integrationsSdwanForm';
import IntegrationsSdwanConfig from '../../components/sdwan-form/integrationsSdwanConfig';
import IntegrationsSdwan from './integrations-sdwan';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('SdwanService', () => {
  let injector: TestBed;
  let service: SdwanService;
  let httpMock: HttpTestingController;
  let sdwanStoreSpy: Store<IntegrationsSdwan>;

  const error = {status: 500, statusText: 'Server Error'};

  beforeEach(() => {
      sdwanStoreSpy = new Store<IntegrationsSdwan>(SdwanService.INITIAL_STATE, {name: SdwanService.STORE_NAME});
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          LoggerTestingModule
        ],
        providers: [
          CommonService,
          {provide: Store, useValue: sdwanStoreSpy}
        ]
      });
      injector = getTestBed();
      service = injector.inject(SdwanService);
      httpMock = injector.inject(HttpTestingController);
    }
  );

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSdwanStatus$', () => {
    const validGetResponse: IntegrationsSdwan = {
      config: {hostname: 'hostname', username: 'username', headers: [{name: 'name', value: 'value', base64: true}]},
      provided: false,
      status: ConfigurationEnum.VALID,
      statusMessage: 'message'
    };

    it('should call api and store the result', (done) => {
      spyOn(sdwanStoreSpy, 'update').and.callThrough();
      spyOn(sdwanStoreSpy, 'setLoading').and.callThrough();
      service.getSdwan().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(validGetResponse);
        done();
      });
      const req = httpMock.expectOne(SdwanService.SDWAN_VALIDATE_URL);
      expect(req.request.method).toEqual('POST');
      req.flush(validGetResponse);
      expect(sdwanStoreSpy.update).toHaveBeenCalledWith(jasmine.objectContaining(validGetResponse));
      expect(sdwanStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      spyOn(sdwanStoreSpy, 'setError').and.callThrough();
      spyOn(sdwanStoreSpy, 'setLoading').and.callThrough();
      service.getSdwan().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(SdwanService.SDWAN_VALIDATE_URL);
      expect(req.request.method).toEqual('POST');
      req.flush({}, error);
      expect(sdwanStoreSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(sdwanStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateSdwan$', () => {
    const rtnResponse: IntegrationsSdwanConfig = {
      hostname: 'hostname',
      username: 'username',
      headers: [{name: 'name', value: 'value', base64: true}]
    };
    it('should call the PUT API request', (done) => {
      spyOn(sdwanStoreSpy, 'setLoading').and.callThrough();
      const params: IntegrationSdwanForm = {
        hostname: 'hostname',
        username: 'username',
        password: 'password',
        headers: [{name: 'name', value: 'value', base64: true}]
      };
      service.updateSdwan(params).subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(rtnResponse);
        expect(sdwanStoreSpy.setLoading).toHaveBeenCalledTimes(2);
        done();
      });
      const req = httpMock.expectOne(SdwanService.SDWAN_CONFIG_URL);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(params);
      req.flush(rtnResponse);
    });

    it('should handle error if PUT API request errors', (done) => {
      spyOn(sdwanStoreSpy, 'setLoading').and.callThrough();
      const params: IntegrationSdwanForm = {
        hostname: 'hostname',
        username: 'username',
        password: 'password'
      };
      service.updateSdwan(params).subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          expect(sdwanStoreSpy.setLoading).toHaveBeenCalledTimes(2);
          done();
        });
      const req = httpMock.expectOne(SdwanService.SDWAN_CONFIG_URL);
      req.flush({}, error);
    });
  });

  describe('deleteSdwan$', () => {
    const rtnResponse: IntegrationsSdwanConfig = {
      hostname: '',
      username: ''
    };
    it('should call the DELETE API request', (done) => {
      spyOn(sdwanStoreSpy, 'setLoading').and.callThrough();
      service.deleteSdwan().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(rtnResponse);
        expect(sdwanStoreSpy.setLoading).toHaveBeenCalledTimes(2);
        done();
      });
      const req = httpMock.expectOne(SdwanService.SDWAN_CONFIG_URL);
      expect(req.request.method).toEqual('DELETE');
      req.flush(rtnResponse);
    });

    it('should handle error if DELETE API request errors', (done) => {
      spyOn(sdwanStoreSpy, 'setLoading').and.callThrough();

      service.deleteSdwan().subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          expect(sdwanStoreSpy.setLoading).toHaveBeenCalledTimes(2);
          done();
        });
      const req = httpMock.expectOne(SdwanService.SDWAN_CONFIG_URL);
      req.flush({}, error);
    });
  });
});
