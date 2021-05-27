import { TestBed } from '@angular/core/testing';

import { DeviceSummaryWidgetDataGeneratorService } from './device-summary-widget-data-generator.service';

describe('DeviceSummaryWidgetDataGeneratorService', () => {
  let service: DeviceSummaryWidgetDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceSummaryWidgetDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
