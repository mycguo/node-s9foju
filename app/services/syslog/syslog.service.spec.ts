import { TestBed } from '@angular/core/testing';

import { SyslogService } from './syslog.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('SyslogService', () => {
  let service: SyslogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(SyslogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
