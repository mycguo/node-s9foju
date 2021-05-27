import { TestBed } from '@angular/core/testing';

import { PreConfiguredOidPollingService } from './pre-configured-oid-polling.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('PreConfiguredOidPollingService', () => {
  let service: PreConfiguredOidPollingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(PreConfiguredOidPollingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
