import {TestBed} from '@angular/core/testing';

import {AlertIdentifiersService} from './alert-identifiers.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore, QueryEntity} from '@datorama/akita';
import {AlertIdentifiersState} from '../nx-alert-management/models/alert-identifiers-state';
import {CommonService} from '../../../../utils/common/common.service';
import {of} from 'rxjs';
import {AlertIdentifier} from './models/alert-identifier';
import {AlertIdentifierSource} from './alert-identifier-source.enum';
import {AlertIdentifiersServiceFixtures} from './alert-identifiers.service.fixtures';
import {AlertIdentifierRequest} from './models/alert-identifier-request';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('AlertIdentifiersService', () => {
  const ERROR_RESPONSE = {status: 500, statusText: 'Server Error'};

  let service: AlertIdentifiersService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<AlertIdentifiersState>;
  let querySpy: QueryEntity<AlertIdentifiersState>;

  beforeEach(() => {
    storeSpy = new EntityStore<AlertIdentifiersState>(AlertIdentifiersService.INITIAL_STATE, {
      name: AlertIdentifiersService.STORE_NAME
    });
    querySpy = new QueryEntity<AlertIdentifiersState>(storeSpy);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CommonService,
        {provide: EntityStore, useValue: storeSpy},
        {provide: QueryEntity, useValue: querySpy}
      ]
    });
    service = TestBed.inject(AlertIdentifiersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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

  describe('selectAlertIdentifiers', () => {
    it('should query the store', (done) => {
      spyOn(querySpy, 'selectAll').and.returnValue(of([]));
      service.selectAlertIdentifiers()
        .subscribe((alerts: Array<AlertIdentifier>) => {
          expect(alerts.length).toEqual(0);
          expect(querySpy.selectAll).toHaveBeenCalledWith(void 0);
          done();
        });
    });

    it('should query the store based on the source', (done) => {
      spyOn(querySpy, 'selectAll').and.returnValue(of([]));
      service.selectAlertIdentifiers(AlertIdentifierSource.LIVE_NX)
        .subscribe((alerts: Array<AlertIdentifier>) => {
          expect(alerts.length).toEqual(0);
          expect(querySpy.selectAll).toHaveBeenCalledWith({
            filterBy: jasmine.any(Function)
          });
          done();
        });
    });
  });

  describe('getIdentifiers', () => {
    it('should return alert identifiers and set/update the store', (done) => {
      spyOn(storeSpy, 'upsertMany').and.callThrough();
      service.getIdentifiers(AlertIdentifierSource.LIVE_NX)
        .subscribe((alerts: Array<AlertIdentifier>) => {
          expect(alerts.length).toBeGreaterThan(0);
          expect(storeSpy.upsertMany).toHaveBeenCalled();
          done();
        });
      const req = httpMock.expectOne(`${AlertIdentifiersService.ALERT_IDENTIFIERS_URL}?source=LIVE_NX`);
      expect(req.request.method).toEqual('GET');
      req.flush({identifiers: AlertIdentifiersServiceFixtures.IDENTIFIERS});
    });

    it('should return and store an error if the request errors', (done) => {
      spyOn(storeSpy, 'setError').and.callThrough();
      service.getIdentifiers(AlertIdentifierSource.LIVE_NX)
        .subscribe((alerts: Array<AlertIdentifier>) => {
            expect(alerts).not.toBeDefined();
            done();
          },
          (error: Error) => {
            expect(storeSpy.setError).toHaveBeenCalled();
            expect(error).toBeDefined();
            expect(error).toEqual(jasmine.objectContaining(error));
            done();
          });
      const req = httpMock.expectOne(`${AlertIdentifiersService.ALERT_IDENTIFIERS_URL}?source=LIVE_NX`);
      expect(req.request.method).toEqual('GET');
      req.flush({}, ERROR_RESPONSE);
    });
  });

  describe('updateAlerts', () => {
    it('should set enable on alerts when bulk update succeeds', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      const alertRequests = AlertIdentifiersServiceFixtures.ALERT_REQUESTS;
      service.updateAlerts(alertRequests, true)
        .subscribe((successMsg: string) => {
          expect(successMsg).toBeDefined();
          expect(storeSpy.update).toHaveBeenCalledWith(
            alertRequests.map((alertRequest: AlertIdentifierRequest) => alertRequest.id),
            {enabled: true}
          );
          done();
        });
      const req = httpMock.expectOne(AlertIdentifiersService.BATCH_ALERT_URL);
      expect(req.request.method).toEqual('PUT');
      const allAlertsEnabled = req.request.body.every((alertRequst: AlertIdentifierRequest) => {
        return alertRequst.enabled;
      });
      expect(allAlertsEnabled).toBeTruthy();
      req.flush({results: [{status: 200}]});
    });

    it('should error if one of the bulk updates fails', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      const alertRequests = AlertIdentifiersServiceFixtures.ALERT_REQUESTS;
      service.updateAlerts(alertRequests, true)
        .subscribe((successMsg: string) => {
            expect(successMsg).not.toBeDefined();
            done();
          },
          (error) => {
            expect(error).toBeDefined();
            expect(storeSpy.update).not.toHaveBeenCalled();
            done();
          });
      const req = httpMock.expectOne(AlertIdentifiersService.BATCH_ALERT_URL);
      expect(req.request.method).toEqual('PUT');
      req.flush({results: [{status: 200}, {status: 500}]});
    });

    it('should error request errors', (done) => {
      spyOn(storeSpy, 'update').and.callThrough();
      const alertRequests = AlertIdentifiersServiceFixtures.ALERT_REQUESTS;
      service.updateAlerts(alertRequests, true)
        .subscribe((successMsg: string) => {
            expect(successMsg).not.toBeDefined();
            done();
          },
          (error) => {
            expect(error).toBeDefined();
            expect(storeSpy.update).not.toHaveBeenCalled();
            done();
          });
      const req = httpMock.expectOne(AlertIdentifiersService.BATCH_ALERT_URL);
      expect(req.request.method).toEqual('PUT');
      req.flush({}, ERROR_RESPONSE);
    });
  });
});
