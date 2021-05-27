import { TestBed } from '@angular/core/testing';

import { FilteredReportTableConfigGeneratorService } from './filtered-report-table-config-generator.service';

describe('FilteredReportTableConfigGeneratorService', () => {
  let service: FilteredReportTableConfigGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteredReportTableConfigGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
