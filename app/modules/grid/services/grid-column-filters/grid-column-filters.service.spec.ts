import { TestBed } from '@angular/core/testing';

import { GridColumnFiltersService } from './grid-column-filters.service';

describe('GridColumnFiltersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridColumnFiltersService = TestBed.get(GridColumnFiltersService);
    expect(service).toBeTruthy();
  });
});
