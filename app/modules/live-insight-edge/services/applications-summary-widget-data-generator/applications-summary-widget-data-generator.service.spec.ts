import { TestBed } from '@angular/core/testing';

import { ApplicationsSummaryWidgetDataGeneratorService } from './applications-summary-widget-data-generator.service';

describe('ApplicationsSummaryWidgetDataGeneratorService', () => {
  let service: ApplicationsSummaryWidgetDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationsSummaryWidgetDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
