import { TestBed } from '@angular/core/testing';

import { UnconfiguredMessageService } from './unconfigured-message.service';

describe('UnconfiguredMessageService', () => {
  let service: UnconfiguredMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnconfiguredMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
