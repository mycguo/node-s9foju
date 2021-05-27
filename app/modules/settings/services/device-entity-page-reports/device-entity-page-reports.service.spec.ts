import {TestBed} from '@angular/core/testing';

import {DeviceEntityPageReportsService} from './device-entity-page-reports.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('DeviceEntityPageReportsService', () => {
  let service: DeviceEntityPageReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(DeviceEntityPageReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
