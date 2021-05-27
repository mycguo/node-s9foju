import { TestBed } from '@angular/core/testing';

import { LiveInsightEdgePageService } from './live-insight-edge-page.service';

describe('LiveInsightEdgePageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiveInsightEdgePageService = TestBed.get(LiveInsightEdgePageService);
    expect(service).toBeTruthy();
  });
});
