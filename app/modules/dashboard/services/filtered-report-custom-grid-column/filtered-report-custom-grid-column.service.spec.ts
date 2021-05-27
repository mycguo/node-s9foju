import { TestBed } from '@angular/core/testing';

import { FilteredReportCustomGridColumnService } from './filtered-report-custom-grid-column.service';

describe('FilteredCustomGridColumnService', () => {
  let service: FilteredReportCustomGridColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteredReportCustomGridColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
