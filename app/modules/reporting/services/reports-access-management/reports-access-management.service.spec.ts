import { TestBed } from '@angular/core/testing';

import { ReportsAccessManagementService } from './reports-access-management.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('ReportsAccessManagementService', () => {
  let service: ReportsAccessManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(ReportsAccessManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
