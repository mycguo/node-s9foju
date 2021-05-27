import { TestBed } from '@angular/core/testing';

import { AnalyticsPlatformAddDeviceService } from './analytics-platform-add-device.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('AnalyticsPlatformAddDeviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerTestingModule,
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: AnalyticsPlatformAddDeviceService = TestBed.get(AnalyticsPlatformAddDeviceService);
    expect(service).toBeTruthy();
  });
});
