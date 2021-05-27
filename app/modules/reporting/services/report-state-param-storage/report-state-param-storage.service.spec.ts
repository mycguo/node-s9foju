import { TestBed } from '@angular/core/testing';

import { ReportStateParamStorageService } from './report-state-param-storage.service';

describe('ReportStateParamStorageService', () => {
  let service: ReportStateParamStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportStateParamStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
