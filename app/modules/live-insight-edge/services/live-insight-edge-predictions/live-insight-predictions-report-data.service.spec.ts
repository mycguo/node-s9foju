import { TestBed } from '@angular/core/testing';

import { LiveInsightPredictionsReportDataService } from './live-insight-predictions-report-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightPredictionsReportDataService', () => {
  let service: LiveInsightPredictionsReportDataService;


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
    service = TestBed.inject(LiveInsightPredictionsReportDataService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
