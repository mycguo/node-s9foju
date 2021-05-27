import { TestBed } from '@angular/core/testing';

import { LiveInsightEdgeReportStateService } from './live-insight-edge-report-state.service';

describe('LiveInsightEdgeReportStateService', () => {
  let service: LiveInsightEdgeReportStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveInsightEdgeReportStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
