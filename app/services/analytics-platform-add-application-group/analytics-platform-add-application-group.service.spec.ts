import { TestBed } from '@angular/core/testing';

import { AnalyticsPlatformAddApplicationGroupService } from './analytics-platform-add-application-group.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('AnalyticsPlatformAddApplicationGroupService', () => {
  let service: AnalyticsPlatformAddApplicationGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule,
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(AnalyticsPlatformAddApplicationGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
