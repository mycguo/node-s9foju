import { TestBed } from '@angular/core/testing';

import { SiteSummaryWidgetDataGeneratorService } from './site-summary-widget-data-generator.service';

describe('SiteSummaryWidgetDataGeneratorService', () => {
  let service: SiteSummaryWidgetDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteSummaryWidgetDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
