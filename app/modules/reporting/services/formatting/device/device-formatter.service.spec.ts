import { TestBed } from '@angular/core/testing';

import { DeviceFormatterService } from './device-formatter.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {LoggerTestingModule} from '../../../../logger/logger-testing/logger-testing.module';

describe('DeviceFormatterService', () => {
  let service: DeviceFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        CookieService
      ]
    });
    service = TestBed.inject(DeviceFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
