import {TestBed} from '@angular/core/testing';

import {CouriersService} from './couriers.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore} from '@datorama/akita';
import {CouriersState} from './models/courier-state';
import {CouriersServiceFixtures} from './couriers.service.fixtures';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('CouriersService', () => {
  let service: CouriersService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<CouriersState>;

  beforeEach(() => {
    storeSpy = new EntityStore<CouriersState>(CouriersService.INITIAL_STATE, {name: CouriersService.STORE_NAME});
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: EntityStore, useValue: storeSpy}
      ]
    });
    service = TestBed.inject(CouriersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCouriers$', () => {
    it('should call the api and store the result', (done) => {
      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setActive').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getCouriers().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(jasmine.objectContaining(CouriersServiceFixtures.COURIERS));
        expect(data.length).toEqual(4);
        done();
      });
      const req = httpMock.expectOne(CouriersService.COURIERS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({meta: {}, couriers: CouriersServiceFixtures.COURIER_RESPONSE});
      expect(storeSpy.set).toHaveBeenCalled();
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      const detailedError = {
        message: 'Http failure response for /api/nx/alerting/couriers: 500 Server Error'
      };
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();

      service.getCouriers()
        .subscribe((data) => {
            expect(data).not.toBeDefined();
            done();
          },
          (err) => {
            expect(err).toBeDefined();
            expect(err).toEqual(jasmine.objectContaining(error));
            done();
          });
      const req = httpMock.expectOne(CouriersService.COURIERS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(detailedError));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
