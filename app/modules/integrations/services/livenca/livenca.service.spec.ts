import { TestBed } from '@angular/core/testing';

import { LivencaService } from './livenca.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LivencaService', () => {
  let service: LivencaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
    });
    service = TestBed.inject(LivencaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
