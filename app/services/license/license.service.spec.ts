import { TestBed } from '@angular/core/testing';

import { LicenseService } from './license.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('LicenseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      LoggerTestingModule
    ]
  }));

  it('should be created', () => {
    const service: LicenseService = TestBed.get(LicenseService);
    expect(service).toBeTruthy();
  });
});
