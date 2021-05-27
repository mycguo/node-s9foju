import {TestBed} from '@angular/core/testing';

import {AnalyticsPlatformService} from './analytics-platform.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AnalyticsPlatformRestClientService} from '../analytics-platform-rest-client/analytics-platform-rest-client.service';
import {RequestErrors} from '../../utils/api/request-errors';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import AnalyticsPlatformConfig from './config/analytics-platform-config';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('AnalyticsPlatformService', () => {

  let httpMock: HttpTestingController;
  let service: AnalyticsPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(AnalyticsPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow sending an updated config', () => {
    const config = new AnalyticsPlatformConfig();
    config.port = 1000;
    config.hostname = '1.1.1.1';
    service.setConfig(config);
    const req = httpMock.expectOne(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL);
    const sentConfig = req.request.body;
    expect(sentConfig.hostname).toBe('1.1.1.1');
    expect(sentConfig.port).toBe(1000);
    req.flush({});
  });

  it('should fetch the current config data and put it into the store', () => {
    const config = new AnalyticsPlatformConfig();
    config.port = 1000;
    config.hostname = '1.1.1.1';
    const query = AnalyticsPlatformService.query;
    service.fetchConfig();

    const req = httpMock.expectOne(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL);
    req.flush({
      port: config.port,
      hostname: config.hostname
    });
    const storedValue = query.getValue();
    expect(storedValue.config.hostname).toBe('1.1.1.1');
    expect(storedValue.config.port).toBe(1000);
  });

  it('should allow deleting the currently stored config', () => {
    service.deleteConfig();
    const req = httpMock.expectOne(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL);
    expect(req.request.method).toBe('DELETE');
  });

  it('should return the an observable which emits the state of the config', (done) => {
    const configData = new AnalyticsPlatformConfig();
    configData.port = 1000;
    configData.hostname = '1.1.1.1';
    const subscription = service.configState$().subscribe(
      value => {
        if (value.config && value.config.port === 1000) {
          expect(value.config.hostname).toBe(configData.hostname);
          done();
        }
      }
    );
    service.fetchConfig();
    const req = httpMock.expectOne(AnalyticsPlatformRestClientService.ANALYTICS_CONFIG_URL);
    req.flush(configData);
    subscription.unsubscribe();
  });

  it('should reset the error state in the store', () => {
    const errorMessage = 'This is an error message';
    AnalyticsPlatformService.store.setError(
      <RequestErrors>{
        errorMessage
      }
    );
    const previousState = AnalyticsPlatformService.query.getValue();
    expect(previousState.error.errorMessage).toBe(errorMessage);
    service.resetErrors();
    const state = AnalyticsPlatformService.query.getValue();
    expect(state.error).toBeFalsy();

  });

  // it ('should add the connection status to the store after requesting ' +
  //   'the connection status', () => {
  //
  // });
});
