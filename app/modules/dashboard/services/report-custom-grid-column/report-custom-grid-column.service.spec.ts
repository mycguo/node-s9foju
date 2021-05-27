import { TestBed } from '@angular/core/testing';

import { ReportCustomGridColumn } from './report-custom-grid-column.service';

describe('GridColumnByInfoElementTypeService', () => {
  let service: ReportCustomGridColumn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportCustomGridColumn);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
