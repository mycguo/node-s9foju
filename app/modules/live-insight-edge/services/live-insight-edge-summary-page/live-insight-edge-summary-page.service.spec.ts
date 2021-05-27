import { TestBed } from '@angular/core/testing';

import { LiveInsightEdgeSummaryPageService } from './live-insight-edge-summary-page.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeSummaryPageService', () => {
  let service: LiveInsightEdgeSummaryPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
      ]
    });
    service = TestBed.inject(LiveInsightEdgeSummaryPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
