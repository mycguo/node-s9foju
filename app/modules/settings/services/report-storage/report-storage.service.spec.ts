import { TestBed } from '@angular/core/testing';

import { ReportStorageService } from './report-storage.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ReportStorageService', () => {
  let service: ReportStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(ReportStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
