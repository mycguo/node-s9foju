import {getTestBed, TestBed} from '@angular/core/testing';

import {LogosService} from './logos.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import Logo from './models/logo';
import {of} from 'rxjs';
import {EntityStore, QueryEntity} from '@datorama/akita';
import {LogosState} from './models/logo-state';
import {take} from 'rxjs/operators';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LogosService', () => {
  let injector: TestBed;
  let service: LogosService;
  let httpMock: HttpTestingController;
  let logosStoreSpy: EntityStore<LogosState>;
  let logosQuerySpy: QueryEntity<LogosState>;

  const rtnResponse: Logo = {
    id: '123',
    name: 'file name',
    lastLogoUpdateTime: 22222222
  };

  beforeEach(() => {
    logosStoreSpy = new EntityStore<LogosState>({}, {name: 'logos'});
    logosQuerySpy = new QueryEntity<LogosState>(logosStoreSpy);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: EntityStore, useValue: logosStoreSpy},
        {provide: QueryEntity, useValue: logosQuerySpy}
      ]
    });
    injector = getTestBed();
    service = injector.inject(LogosService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogos$', () => {
    const validGetResponse: { defaultId: string, logos: Array<Logo> } = {
      defaultId: 'abc-123',
      logos: [{id: 'abc-123', name: 'liveaction', lastLogoUpdateTime: 22222222}]
    };

    it('should call the api and store the result', (done) => {
      spyOn(logosStoreSpy, 'set').and.callThrough();
      spyOn(logosStoreSpy, 'setActive').and.callThrough();
      spyOn(logosStoreSpy, 'setLoading').and.callThrough();
      service.getLogos$().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(validGetResponse.logos);
        done();
      });
      const req = httpMock.expectOne(LogosService.LOGOS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush(validGetResponse);
      expect(logosStoreSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(validGetResponse.logos));
      expect(logosStoreSpy.setActive).toHaveBeenCalledWith(validGetResponse.defaultId);
      expect(logosStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(logosStoreSpy, 'setError').and.callThrough();
      spyOn(logosStoreSpy, 'setLoading').and.callThrough();
      service.getLogos$().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(error));
          done();
        });
      const req = httpMock.expectOne(LogosService.LOGOS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, {status: 500, statusText: 'Server Error'});
      expect(logosStoreSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(logosStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('save$', () => {
    it('should error if invalid args are passed in ', (done) => {
      service.save$(
        {
          id: void 0,
          name: void 0,
          file: void 0,
          logosConfig: void 0,
          lastLogoUpdateTime: 0,
          titleText: ''
        }).subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        (err: Error) => {
          expect(err).toBeDefined();
          done();
        });
    });

    describe('addApicem$', () => {

      it('should call the POST API request', (done) => {
        spyOn(service, 'getLogos$').and.returnValue(of(void 0));
        const file = new File(new Array<Blob>(), 'test-file.jpg');
        service.save$({
          id: void 0,
          name: 'fileName',
          file: file,
          logosConfig: void 0,
          lastLogoUpdateTime: 0,
          titleText: ''
        }).pipe(take(1))
          .subscribe(
            (data) => {
              expect(data).toBeUndefined();
              done();
            });
        const req = httpMock.expectOne(LogosService.LOGOS_MULTIPART_URL);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toBeTruthy();
        req.flush(rtnResponse);
      });
    });

    describe('updateApicem$', () => {
      it('should call the PUT API request if only the file name is updated', (done) => {
        const id = '123';
        spyOn(service, 'getLogos$').and.returnValue(of(void 0));
        service.save$(
          {
            id: id,
            name: 'name change',
            file: void 0,
            logosConfig: void 0,
            lastLogoUpdateTime: 0,
            titleText: ''
          }).subscribe(data => {
          expect(data).toBeUndefined();
          done();
        });
        const req = httpMock.expectOne(`${LogosService.LOGOS_MULTIPART_URL}/${id}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toBeTruthy();
        req.flush(rtnResponse);
      });
      it('should call the PUT API request if only the file is updated', (done) => {
        const id = '123';
        const file = new File(new Array<Blob>(), 'test-file.jpg');
        spyOn(service, 'getLogos$').and.returnValue(of(void 0));
        service.save$(
          {
            id: id,
            name: void 0,
            file: file,
            logosConfig: void 0,
            lastLogoUpdateTime: 0,
            titleText: ''
          }).subscribe(data => {
          expect(data).toBeUndefined();
          done();
        });
        const req = httpMock.expectOne(`${LogosService.LOGOS_MULTIPART_URL}/${id}`);
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body).toBeTruthy();
        req.flush(rtnResponse);
      });
    });
  });

  describe('deleteLogo$', () => {
    it('should call the DELETE API request', (done) => {
      const id = '123';
      spyOn(service, 'getLogos$').and.returnValue(of(void 0));
      service.deleteLogo$(id).subscribe(data => {
        expect(data).toBeUndefined();
        done();
      });
      const req = httpMock.expectOne(`${LogosService.LOGOS_URL}/${id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(rtnResponse);
    });
  });

  describe('updateDefault$', () => {
    it('should call the DELETE API request', (done) => {
      const defaultIdResp = {
        id: '123'
      };
      const id = '123';
      spyOn(logosStoreSpy, 'setActive');
      service.updateDefault$(id).subscribe(data => {
        expect(data).toBeDefined();
        expect(logosStoreSpy.setActive).toHaveBeenCalledWith(id);
        done();
      });
      const req = httpMock.expectOne(`${LogosService.LOGOS_URL}/defaultId`);
      expect(req.request.method).toEqual('PUT');
      req.flush(defaultIdResp);
    });
  });

  describe('getLogoConfiguration$', () => {

  });

  describe('resetErrorStore', () => {
    it('should reset the error of the store to void 0', () => {
      spyOn(logosStoreSpy, 'setError');
      service.resetErrorStore();
      expect(logosStoreSpy.setError).toHaveBeenCalledWith(void 0);
    });
  });
});
