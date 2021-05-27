import {TestBed} from '@angular/core/testing';

import {NxAlertManagementService} from './nx-alert-management.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CommonService} from '../../../../utils/common/common.service';
import {of} from 'rxjs';
import {AlertManagementService} from '../alert-management/alert-management.service';
import {NxAlertManagementStore} from '../../stores/nx-alert-management/nx-alert-management.store';
import {NxAlertManagementQuery} from '../../stores/nx-alert-management/nx-alert-management.query';
import {AlertIdentifiersService} from '../alert-identifiers/alert-identifiers.service';
import {CouriersService} from '../couriers/couriers.service';
import {WebUiAlertsService} from '../web-ui-alerts/web-ui-alerts.service';
import {NodesService} from '../../../../services/nodes/nodes.service';
import {CustomOidsService} from '../../../../services/custom-oids/custom-oids.service';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {AlertIdentifiersServiceFixtures} from '../alert-identifiers/alert-identifiers.service.fixtures';
import {CouriersServiceFixtures} from '../couriers/couriers.service.fixtures';
import {WebUiAlertsServiceFixtures} from '../web-ui-alerts/web-ui-alerts.service.fixtures';
import {NodesServiceFixtures} from '../../../../services/nodes/nodes.service.fixtures';
import {CustomOidsServiceFixtures} from '../../../../services/custom-oids/custom-oids.service.fixtures';
import {NxAlertManagementServiceFixtures} from './nx-alert-management.service.fixtures';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('AlertManagementService', () => {
  let service: NxAlertManagementService;
  let httpMock: HttpTestingController;
  let alertStoreSpy: NxAlertManagementStore;
  let alertQuerySpy: NxAlertManagementQuery;
  let alertManagementService: AlertManagementService;
  let alertIdentifierService: AlertIdentifiersService;
  let courierService: CouriersService;
  let webUiAlertsService: WebUiAlertsService;
  let nodesService: NodesService;
  let customOidsService: CustomOidsService;

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
        WebUiAlertsService,
        NodesService,
        CustomOidsService
      ]
    });
    service = TestBed.inject(NxAlertManagementService);
    httpMock = TestBed.inject(HttpTestingController);
    alertManagementService = TestBed.inject(AlertManagementService);
    alertStoreSpy = TestBed.inject(NxAlertManagementStore);
    alertQuerySpy = TestBed.inject(NxAlertManagementQuery);
    alertIdentifierService = TestBed.inject(AlertIdentifiersService);
    courierService = TestBed.inject(CouriersService);
    webUiAlertsService = TestBed.inject(WebUiAlertsService);
    nodesService = TestBed.inject(NodesService);
    customOidsService = TestBed.inject(CustomOidsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should update store as dependency changes when not loading', (done) => {
      spyOn(service, 'selectLoading').and.returnValue(hot('-x-------|', {x: true}));
      spyOn(alertIdentifierService, 'selectAlertIdentifiers').and.returnValue(hot(
        '--x|', {x: AlertIdentifiersServiceFixtures.IDENTIFIERS}));
      spyOn(courierService, 'selectCouriers').and.returnValue(hot('--x|', {x: CouriersServiceFixtures.COURIERS}));
      spyOn(webUiAlertsService, 'selectWebUiAlerts').and.returnValue(hot('--x|', {x: WebUiAlertsServiceFixtures.WEB_UI_ALERTS}));
      spyOn(nodesService, 'selectNodes').and.returnValue(hot('--x|', {x: NodesServiceFixtures.NODES}));
      spyOn(customOidsService, 'selectCustomOids').and.returnValue(hot('--x|', {x: CustomOidsServiceFixtures.CUSTOM_OIDS}));
      service.selectFilteredAlerts()
        .subscribe((alerts) => {
          expect(alerts).toBeDefined();
          done();
        });
      getTestScheduler().flush();
    });
  });

  describe('data', () => {
    describe('selectLoading', () => {
      it('should return true if a dependent loading is true', (done) => {
        spyOn(alertIdentifierService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
        spyOn(courierService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
        spyOn(webUiAlertsService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
        spyOn(nodesService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
        spyOn(customOidsService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: true}));
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
        spyOn(nodesService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: false}));
        spyOn(customOidsService, 'selectLoading').and.returnValue(hot('-^--x-|', {x: false}));
        service.selectLoading()
          .subscribe((isLoading: boolean) => {
            expect(isLoading).toBeFalsy();
            done();
          });
        getTestScheduler().flush();
      });
    });

    describe('selectError', () => {
      it('should return the error if a dependent has an error', (done) => {
        spyOn(alertIdentifierService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
        spyOn(courierService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
        spyOn(webUiAlertsService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
        spyOn(nodesService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
        spyOn(customOidsService, 'selectError').and.returnValue(hot('-^--x-|', {x: new Error()}));
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
        spyOn(nodesService, 'selectError').and.returnValue(hot('-^--x-|', {x: void 0}));
        spyOn(customOidsService, 'selectError').and.returnValue(hot('-^--x-|', {x: void 0}));
        service.selectError()
          .subscribe((error: Error) => {
            expect(error).toBeUndefined();
            done();
          });
        getTestScheduler().flush();
      });
    });

    describe('getAlerts', () => {
      it('should call gets for dependent services and return identifiers', (done) => {
        spyOn(alertIdentifierService, 'getIdentifiers').and.returnValue(cold('x|', {x: AlertIdentifiersServiceFixtures.IDENTIFIERS}));
        spyOn(courierService, 'getCouriers').and.returnValue(cold('x|', {x: CouriersServiceFixtures.COURIERS}));
        spyOn(webUiAlertsService, 'getWebUiAlerts').and.returnValue(cold('x|', {x: WebUiAlertsServiceFixtures.WEB_UI_ALERTS}));
        spyOn(nodesService, 'getNodes').and.returnValue(cold('x|', {x: NodesServiceFixtures.NODES}));
        spyOn(customOidsService, 'getCustomOids').and.returnValue(cold('x|', {x: CustomOidsServiceFixtures.CUSTOM_OIDS}));
        spyOn(alertManagementService, 'createMissingAlertWebUiSettings').and.returnValue(of(void 0));
        service.getAlerts()
          .subscribe((alerts) => {
            expect(alerts).toBeDefined();
            done();
          });
        getTestScheduler().flush();
        expect(alertIdentifierService.getIdentifiers).toHaveBeenCalled();
        expect(courierService.getCouriers).toHaveBeenCalled();
        expect(webUiAlertsService.getWebUiAlerts).toHaveBeenCalled();
        expect(nodesService.getNodes).toHaveBeenCalled();
        expect(customOidsService.getCustomOids).toHaveBeenCalled();
        expect(alertManagementService.createMissingAlertWebUiSettings).toHaveBeenCalled();
      });
    });

    describe('enabledDisableSelectedAlerts', () => {
      it('should set enabled for selected alerts', (done) => {
        spyOn(alertQuerySpy, 'getActiveId').and.returnValue(NxAlertManagementServiceFixtures.NX_ALERTS.map((alert) => alert.id));
        spyOn(alertQuerySpy, 'getActive').and.returnValue(NxAlertManagementServiceFixtures.NX_ALERTS);
        spyOn(alertIdentifierService, 'updateAlerts').and.returnValue(of({}));
        service.enabledDisableSelectedAlerts(true)
          .subscribe(() => {
            expect(alertIdentifierService.updateAlerts).toHaveBeenCalled();
            done();
          });
      });
    });
  });

  describe('store', () => {
    describe('reset', () => {
      it('should call dependency reset functions', () => {
        spyOn(service, 'clearFilters').and.returnValue(void 0);
        spyOn(alertStoreSpy, 'reset').and.returnValue(void 0);
        spyOn(alertIdentifierService, 'reset').and.returnValue(void 0);
        spyOn(courierService, 'reset').and.returnValue(void 0);
        spyOn(webUiAlertsService, 'reset').and.returnValue(void 0);
        spyOn(nodesService, 'reset').and.returnValue(void 0);
        spyOn(customOidsService, 'reset').and.returnValue(void 0);
      });
    });
  });
});
