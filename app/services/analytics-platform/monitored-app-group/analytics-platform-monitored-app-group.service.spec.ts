import { TestBed } from '@angular/core/testing';

import { AnalyticsPlatformMonitoredAppGroupService } from './analytics-platform-monitored-app-group.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../modules/logger/logger-testing/logger-testing.module';

describe('AnalyticsPlatformMonitoredAppGroupService', () => {
  let service: AnalyticsPlatformMonitoredAppGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
      ]
    });
    service = TestBed.inject(AnalyticsPlatformMonitoredAppGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
