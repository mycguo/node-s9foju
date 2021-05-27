import { TestBed } from '@angular/core/testing';
import {ReportTableDataGeneratorService} from './report-table-data-generator.service';


describe('ReportTableConfigGeneratorService', () => {
  let service: ReportTableDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportTableDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
