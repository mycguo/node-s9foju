import { TestBed } from '@angular/core/testing';

import { CustomOidPollingService } from './custom-oid-polling.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntityStore } from '@datorama/akita';
import { CustomOidsState } from '../../../../services/custom-oids/models/custom-oid-state';
import { CustomOidsServiceFixtures } from '../../../../services/custom-oids/custom-oids.service.fixtures';
import { CustomOidPollingServiceFixtures } from './custom-oid-polling.service.fixtures';
import { CustomOidsService } from '../../../../services/custom-oids/custom-oids.service';
import { CustomOidPollingDevicesService } from './custom-oid-polling-devices.service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('CustomOidPollingService', () => {
  let service: CustomOidPollingService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<CustomOidsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
    });
    service = TestBed.inject(CustomOidPollingService);
    httpMock = TestBed.inject(HttpTestingController);
    storeSpy = CustomOidPollingService.store;
  });

  afterEach(() => {
    httpMock.verify();
    service.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCustomOidPolling', () => {
    it('should return OIDs config and set the store', (done) => {
      spyOn(storeSpy, 'setLoading').and.callThrough();
      spyOn(storeSpy, 'set').and.callThrough();

      service.getCustomOidPolling()
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(jasmine.objectContaining(CustomOidPollingServiceFixtures.OID_CONFIGURATION));
          done();
        });

      const oidReq = httpMock.expectOne(CustomOidsService.CUSTOM_OIDS_URL);
      expect(oidReq.request.method).toEqual('GET');
      oidReq.flush({configurations: CustomOidsServiceFixtures.CUSTOM_OIDS});

      const devicesReq = httpMock.expectOne(
        `${CustomOidPollingDevicesService.DEVICES_ENDPOINT}?isCompactResponse=true&includeNonSnmp=false`
      );
      expect(devicesReq.request.method).toEqual('GET');
      devicesReq.flush(CustomOidPollingServiceFixtures.DEVICES_RESPONSE);

      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(CustomOidPollingServiceFixtures.OID_CONFIGURATION));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      spyOn(storeSpy, 'setLoading').and.callThrough();
      spyOn(storeSpy, 'setError').and.callThrough();
      service.getCustomOidPolling()
        .subscribe(data => {
          expect(data).not.toBeDefined();
          done();
        }, error => {
          expect(error).toBeDefined();
          expect(error).toEqual(jasmine.objectContaining(CustomOidPollingServiceFixtures.ERROR_RESPONSE));
          done();
        });

      const oidReq = httpMock.expectOne(CustomOidsService.CUSTOM_OIDS_URL);
      const devicesReq = httpMock.expectOne(
        `${CustomOidPollingDevicesService.DEVICES_ENDPOINT}?isCompactResponse=true&includeNonSnmp=false`
      );
      expect(oidReq.request.method).toEqual('GET');
      expect(devicesReq.request.method).toEqual('GET');
      oidReq.flush({}, CustomOidPollingServiceFixtures.ERROR_RESPONSE);
      expect(devicesReq.cancelled).toBeTruthy();

      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(CustomOidPollingServiceFixtures.ERROR_RESPONSE));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });
});
