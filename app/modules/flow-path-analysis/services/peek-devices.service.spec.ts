import { TestBed } from '@angular/core/testing';

import { PeekDevicesService } from './peek-devices.service';
import {PeekDeviceStore} from '../store/peek-device.store';
import {PeekDeviceQuery} from '../store/peek-device.query';
import {of} from 'rxjs';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import PeekDevice from '../models/peek-device';
import {PeekDevicesServiceFixtures} from './peek-devices.service.fixtures';
import {NodesService} from '../../../services/nodes/nodes.service';
import {NodesServiceFixtures} from '../../../services/nodes/nodes.service.fixtures';
import {LoggerTestingModule} from '../../logger/logger-testing/logger-testing.module';

describe('PeekDevicesService', () => {
  let service: PeekDevicesService;
  let httpMock: HttpTestingController;
  let storeSpy: PeekDeviceStore;
  const querySpy: PeekDeviceQuery = new PeekDeviceQuery(new PeekDeviceStore());

    beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        PeekDeviceStore,
        NodesService,
        {provide: PeekDeviceQuery, useValue: querySpy}
      ]
    });
    service = TestBed.inject(PeekDevicesService);
    httpMock = TestBed.inject(HttpTestingController);
    storeSpy = TestBed.inject(PeekDeviceStore);
  });

  afterEach(() => {
    httpMock.verify();
    storeSpy.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('reset', () => {
    it('should call reset on the store', () => {
      spyOn(storeSpy, 'reset').and.returnValue(void 0);
      service.reset();
      expect(storeSpy.reset).toHaveBeenCalled();
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

  describe('getPeekDevices', () => {
    it('should return peek devices and set the store', (done) => {
      spyOn(storeSpy, 'set').and.callThrough();
      service.getPeekDevices(PeekDevicesServiceFixtures.DRILLDOWN)
        .subscribe((devices: Array<PeekDevice>) => {
          expect(devices.length).toBeGreaterThan(0);
          expect(storeSpy.set).toHaveBeenCalled();
          expect(devices).toEqual(PeekDevicesServiceFixtures.PEEK_DEVICES);
          done();
        });
      const devicesReq = httpMock.expectOne(PeekDevicesService.PEEK_DEVICE_SEARCH_ENDPOINT);
      const nodesReq = httpMock.expectOne(NodesService.NODES_URL);
      expect(devicesReq.request.method).toEqual('POST');
      expect(nodesReq.request.method).toEqual('GET');
      devicesReq.flush({devices: PeekDevicesServiceFixtures.DEVICES_RESPONSE});
      nodesReq.flush({meta: {}, nodes: NodesServiceFixtures.NODES});
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(PeekDevicesServiceFixtures.PEEK_DEVICES));
    });

    it('should return and store an error if the request errors', (done) => {
      spyOn(storeSpy, 'setError').and.callThrough();
      service.getPeekDevices(PeekDevicesServiceFixtures.DRILLDOWN)
        .subscribe((apps: Array<PeekDevice>) => {
            expect(apps).not.toBeDefined();
            done();
          },
          (error: Error) => {
            expect(storeSpy.setError).toHaveBeenCalled();
            expect(error).toBeDefined();
            expect(error).toEqual(jasmine.objectContaining(error));
            done();
          });
      const devicesReq = httpMock.expectOne(PeekDevicesService.PEEK_DEVICE_SEARCH_ENDPOINT);
      const nodesReq = httpMock.expectOne(NodesService.NODES_URL);
      expect(devicesReq.request.method).toEqual('POST');
      expect(nodesReq.request.method).toEqual('GET');
      devicesReq.flush({}, PeekDevicesServiceFixtures.ERROR_RESPONSE);
      expect(nodesReq.cancelled).toBeTruthy();
    });
  });
});
