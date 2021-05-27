import {TestBed} from '@angular/core/testing';

import {WebUiAlertsService} from './web-ui-alerts.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {EntityStore} from '@datorama/akita';
import {WebUiAlertsState} from './models/web-ui-alert-state';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';
import {WebUiAlertsServiceFixtures} from './web-ui-alerts.service.fixtures';

describe('WebUiAlertsService', () => {
  let service: WebUiAlertsService;
  let httpMock: HttpTestingController;
  let storeSpy: EntityStore<WebUiAlertsState>;

  beforeEach(() => {
    storeSpy = new EntityStore<WebUiAlertsState>(WebUiAlertsService.INITIAL_STATE, {name: WebUiAlertsService.STORE_NAME});
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        {provide: EntityStore, useValue: storeSpy}
      ]
    });
    service = TestBed.inject(WebUiAlertsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWebUiAlerts$', () => {
    it('should call the api and store the result', (done) => {
      spyOn(storeSpy, 'set').and.callThrough();
      spyOn(storeSpy, 'setActive').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();
      service.getWebUiAlerts().subscribe(data => {
        expect(data).toBeDefined();
        expect(data).toEqual(WebUiAlertsServiceFixtures.WEB_UI_ALERTS);
        done();
      });
      const req = httpMock.expectOne(WebUiAlertsService.WEB_UI_NOTIFICATIONS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush(WebUiAlertsServiceFixtures.WEB_UI_ALERTS);
      expect(storeSpy.set).toHaveBeenCalledWith(jasmine.objectContaining(WebUiAlertsServiceFixtures.WEB_UI_ALERTS));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(3);
    });

    it('should call api and store the error', (done) => {
      const error = {status: 500, statusText: 'Server Error'};
      spyOn(storeSpy, 'setError').and.callThrough();
      spyOn(storeSpy, 'setLoading').and.callThrough();

      service.getWebUiAlerts()
        .subscribe((data) => {
            expect(data).not.toBeDefined();
            done();
          },
          (err) => {
            expect(err).toBeDefined();
            expect(err).toEqual(jasmine.objectContaining(error));
            done();
          });
      const req = httpMock.expectOne(WebUiAlertsService.WEB_UI_NOTIFICATIONS_URL);
      expect(req.request.method).toEqual('GET');
      req.flush({}, error);
      expect(storeSpy.setError).toHaveBeenCalledWith(jasmine.objectContaining(error));
      expect(storeSpy.setLoading).toHaveBeenCalledTimes(3);
    });
  });
});
