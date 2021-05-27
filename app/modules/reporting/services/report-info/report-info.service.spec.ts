import { TestBed } from '@angular/core/testing';

import { ReportInfoService } from './report-info.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ReportInfoService', () => {
  let service: ReportInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(ReportInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
