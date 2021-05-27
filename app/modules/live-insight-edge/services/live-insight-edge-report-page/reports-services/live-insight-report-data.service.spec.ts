import { TestBed } from '@angular/core/testing';

import { LiveInsightReportDataService } from './live-insight-report-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {LoggerTestingModule} from '../../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightReportDataService', () => {
  let service: LiveInsightReportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CookieService
      ]
    });
    service = TestBed.inject(LiveInsightReportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
