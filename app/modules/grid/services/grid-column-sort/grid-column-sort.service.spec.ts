import { TestBed } from '@angular/core/testing';

import { GridColumnSortService } from './grid-column-sort.service';

describe('GridColumnSortService', () => {
  let service: GridColumnSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridColumnSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
