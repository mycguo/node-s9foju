import {TestBed} from '@angular/core/testing';

import {CustomOidsService} from './custom-oids.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore} from '@datorama/akita';
import {CustomOidsState} from './models/custom-oid-state';
import {CustomOidsServiceFixtures} from './custom-oids.service.fixtures';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('CustomOidsService', () => {
  let service: CustomOidsService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<CustomOidsState>;

  beforeEach(() => {
    storeSpy = new EntityStore<CustomOidsState>(CustomOidsService.INITIAL_STATE, {name: CustomOidsService.STORE_NAME});
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: EntityStore, useValue: storeSpy}
      ]
    });
    service = TestBed.inject(CustomOidsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCustomOids$', () => {
    it('should call the api and store the result', (done) => {

      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setActive').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getCustomOids().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(CustomOidsServiceFixtures.CUSTOM_OIDS);
        done();
      });
      const req = httpMock.expectOne(CustomOidsService.CUSTOM_OIDS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({meta: {}, configurations: CustomOidsServiceFixtures.CUSTOM_OIDS});
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(CustomOidsServiceFixtures.CUSTOM_OIDS));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();

      service.getCustomOids()
        .subscribe((data) => {
            expect(data).not.toBeDefined();
            done();
          },
          (err) => {
            expect(err).toBeDefined();
            expect(err).toEqual(jasmine.objectContaining(error));
            done();
          });
      const req = httpMock.expectOne(CustomOidsService.CUSTOM_OIDS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
