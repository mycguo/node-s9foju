import {TestBed} from '@angular/core/testing';

import {SdwanAlertManagementService} from './sdwan-alert-management.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CommonService} from '../../../../utils/common/common.service';
import {AlertManagementService} from '../alert-management/alert-management.service';
import {NxAlertManagementStore} from '../../stores/nx-alert-management/nx-alert-management.store';
import {NxAlertManagementQuery} from '../../stores/nx-alert-management/nx-alert-management.query';
import {CouriersService} from '../couriers/couriers.service';
import {WebUiAlertsService} from '../web-ui-alerts/web-ui-alerts.service';
import {AlertIdentifiersService} from '../alert-identifiers/alert-identifiers.service';
import {getTestScheduler, hot} from 'jasmine-marbles';
import {AlertIdentifiersServiceFixtures} from '../alert-identifiers/alert-identifiers.service.fixtures';
import {CouriersServiceFixtures} from '../couriers/couriers.service.fixtures';
import {WebUiAlertsServiceFixtures} from '../web-ui-alerts/web-ui-alerts.service.fixtures';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('SdwanAlertManagementService', () => {
  let service: SdwanAlertManagementService;
  let httpMock: HttpTestingController;
  let alertStoreSpy: NxAlertManagementStore;
  let alertQuerySpy: NxAlertManagementQuery;
  let alertManagementService: AlertManagementService;
  let alertIdentifierService: AlertIdentifiersService;
  let courierService: CouriersService;
  let webUiAlertsService: WebUiAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CommonService,
        AlertManagementService,
        AlertIdentifiersService,
        CouriersService,
        WebUiAlertsService
      ]
    });
    service = TestBed.inject(SdwanAlertManagementService);
    httpMock = TestBed.inject(HttpTestingController);
    alertManagementService = TestBed.inject(AlertManagementService);
    alertStoreSpy = TestBed.inject(NxAlertManagementStore);
    alertQuerySpy = TestBed.inject(NxAlertManagementQuery);
    alertIdentifierService = TestBed.inject(AlertIdentifiersService);
    courierService = TestBed.inject(CouriersService);
    webUiAlertsService = TestBed.inject(WebUiAlertsService);
  });

  describe('constructor', () => {
    it('should update store as dependency changes when not loading', (done) => {
      spyOn(service, 'selectLoading').and.returnValue(hot('-x-------|', {x: true}));
      spyOn(alertIdentifierService, 'selectAlertIdentifiers').and.returnValue(hot(
        '--x|', {x: AlertIdentifiersServiceFixtures.IDENTIFIERS}));
      spyOn(courierService, 'selectCouriers').and.returnValue(hot('--x|', {x: CouriersServiceFixtures.COURIERS}));
      spyOn(webUiAlertsService, 'selectWebUiAlerts').and.returnValue(hot('--x|', {x: WebUiAlertsServiceFixtures.WEB_UI_ALERTS}));
      service.selectFilteredAlerts()
        .subscribe((alerts) => {
          expect(alerts).toBeDefined();
          done();
        });
      getTestScheduler().flush();
    });
  });

  it('should return true if a dependent loading is true', (done) => {
    spyOn(alertIdentifierService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
    spyOn(courierService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
    spyOn(webUiAlertsService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
    service.selectLoading()
      .subscribe((isLoading: boolean) => {
        expect(isLoading).toBeTruthy();
        done();
      });
    getTestScheduler().flush();
  });

  it('should return false if all dependents loading is false', (done) => {
    spyOn(alertIdentifierService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: false}));
    spyOn(courierService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: false}));
    spyOn(webUiAlertsService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: false}));
    service.selectLoading()
      .subscribe((isLoading: boolean) => {
        expect(isLoading).toBeFalsy();
        done();
      });
    getTestScheduler().flush();
  });

  it('should return the error if a dependent has an error', (done) => {
    spyOn(alertIdentifierService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
    spyOn(courierService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
    spyOn(webUiAlertsService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
    service.selectError()
      .subscribe((error: Error) => {
        expect(error).toBeDefined();
        done();
      });
    getTestScheduler().flush();
  });

  it('should return the void if dependents do not have an error', (done) => {
    spyOn(alertIdentifierService, 'selectError').and.returnValue(hot('-^--x-|', {x: void 0}));
    spyOn(courierService, 'selectError').and.returnValue(hot('-^--x-|', {x: void 0}));
    spyOn(webUiAlertsService, 'selectError').and.returnValue(hot('-^--x-|', {x: void 0}));
    service.selectError()
      .subscribe((error: Error) => {
        expect(error).toBeUndefined();
        done();
      });
    getTestScheduler().flush();
  });
});
