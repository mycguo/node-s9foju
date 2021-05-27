import { TestBed } from '@angular/core/testing';

import { EmailConfigurationService } from './email-configuration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('EmailConfigurationService', () => {
  let service: EmailConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(EmailConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
