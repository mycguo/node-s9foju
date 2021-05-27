import { TestBed } from '@angular/core/testing';

import { DeviceAutoRefreshService } from './device-auto-refresh.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('DeviceAutoRefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      LoggerTestingModule
    ]
  }));

  it('should be created', () => {
    const service: DeviceAutoRefreshService = TestBed.get(DeviceAutoRefreshService);
    expect(service).toBeTruthy();
  });
});
