import {TestBed} from '@angular/core/testing';

import {DataManagementService} from './data-management.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore} from '@datorama/akita';
import {DataManagementServiceFixtures} from './data-management.service.fixtures';
import {TaskTypes} from './enums/task-types.enum';
import {DataManagementNodeConfigState} from './interfaces/data-management-node-config-state';
import {DataManagementNodeConfigResponse} from './interfaces/data-management-node-config-response';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('DataManagementService', () => {
  let service: DataManagementService;
  let httpMock: HttpTestingController;
  let nodesConfigStoreSpy: EntityStore<DataManagementNodeConfigState, DataManagementNodeConfigResponse, string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(DataManagementService);
    httpMock = TestBed.inject(HttpTestingController);
    nodesConfigStoreSpy = DataManagementService.nodesConfigStore;

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConfiguration', () => {
    it('should return nodes config and set the store', (done) => {
      spyOn(nodesConfigStoreSpy, 'setLoading').and.callThrough();
      spyOn(nodesConfigStoreSpy, 'set').and.callThrough();

      service.getConfiguration()
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE);
          done();
        });

      const req = httpMock.expectOne(DataManagementService.DATA_MANAGEMENT_CONFIG_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush(DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE);

      expect(nodesConfigStoreSpy.set).toHaveBeenCalledWith(
        jasmine.objectContaining(DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG)
      );
      expect(nodesConfigStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should call api and store the error', (done) => {
      spyOn(nodesConfigStoreSpy, 'setError').and.callThrough();
      spyOn(nodesConfigStoreSpy, 'setLoading').and.callThrough();
      service.getConfiguration().subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err).toEqual(jasmine.objectContaining(DataManagementServiceFixtures.ERROR_RESPONSE));
          done();
        });
      const req = httpMock.expectOne(DataManagementService.DATA_MANAGEMENT_CONFIG_ENDPOINT);
      expect(req.request.method).toEqual('GET');
      req.flush({}, DataManagementServiceFixtures.ERROR_RESPONSE);
      expect(nodesConfigStoreSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(DataManagementServiceFixtures.ERROR_RESPONSE));
      expect(nodesConfigStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('setConfiguration', () => {
    it('should call the PUT API endpoint and set the store', (done) => {
      spyOn(nodesConfigStoreSpy, 'setLoading').and.callThrough();
      service.setConfiguration(
        DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE
      )
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE);
          done();
        });

      const req = httpMock.expectOne(
        DataManagementService.DATA_MANAGEMENT_CONFIG_ENDPOINT
      );
      expect(req.request.method).toEqual('PUT');
      req.flush(DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE);
      expect(req.request.body).toEqual(DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE);
      expect(nodesConfigStoreSpy.setLoading).toHaveBeenCalledTimes(1);
    });

    it('should call the PUT API endpoint and store the error', (done) => {
      spyOn(nodesConfigStoreSpy, 'setLoading').and.callThrough();
      service.setConfiguration(
        DataManagementServiceFixtures.DATA_MANAGEMENT_CONFIG_RESPONSE
      ).subscribe(
        data => {
          expect(data).not.toBeDefined();
          done();
        },
        err => {
          expect(err).toBeDefined();
          done();
        });
      const req = httpMock.expectOne(
        DataManagementService.DATA_MANAGEMENT_CONFIG_ENDPOINT
      );
      expect(req.request.method).toEqual('PUT');
      req.flush({}, DataManagementServiceFixtures.ERROR_RESPONSE);
      expect(nodesConfigStoreSpy.setLoading).toHaveBeenCalledTimes(2);
    });
  });

  describe('runTask', () => {
    const response = 'Backup Job Started successfully';
    it('should run backup task', (done) => {
      service.runTask(TaskTypes.BACKUP, DataManagementServiceFixtures.BACKUP_REQUEST)
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(response);
          done();
        });
      const req = httpMock.expectOne(DataManagementService.DATA_MANAGEMENT_ENDPOINT + '/backup');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(DataManagementServiceFixtures.BACKUP_REQUEST);
      req.flush({response: response});
    });

    it('should call the POST API for backup task and return error', (done) => {
      service.runTask(TaskTypes.BACKUP, DataManagementServiceFixtures.BACKUP_REQUEST)
        .subscribe(data => {
            expect(data).not.toBeDefined();
            done();
          },
          err => {
            expect(err).toBeDefined();
            expect(err).toEqual(jasmine.objectContaining(DataManagementServiceFixtures.BACKUP_ERROR_RESPONSE));
            done();
          });
      const req = httpMock.expectOne(DataManagementService.DATA_MANAGEMENT_ENDPOINT + '/backup');
      expect(req.request.method).toEqual('POST');
      req.flush({}, DataManagementServiceFixtures.BACKUP_ERROR_RESPONSE);
    });
  });

  describe('getTaskStatus', () => {
    it('should get backup task status', (done) => {
      service.getTaskStatus(TaskTypes.BACKUP)
        .subscribe(data => {
          expect(data).toBeDefined();
          expect(data).toEqual(DataManagementServiceFixtures.BACKUP_STATUS_RESPONSE);
          done();
        });
      const req = httpMock.expectOne(DataManagementService.DATA_MANAGEMENT_ENDPOINT + '/backup/status');
      expect(req.request.method).toEqual('GET');
      req.flush(DataManagementServiceFixtures.BACKUP_STATUS_RESPONSE);
    });
  });
});
