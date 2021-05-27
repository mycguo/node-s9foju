import { TestBed } from '@angular/core/testing';

import { StatusSortService } from './status-sort.service';

describe('StatusSortService', () => {
  let service: StatusSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
