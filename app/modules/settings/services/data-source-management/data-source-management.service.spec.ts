import { TestBed } from '@angular/core/testing';

import { DataSourceManagementService } from './data-source-management.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('DataSourceManagementService', () => {
  let service: DataSourceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(DataSourceManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
