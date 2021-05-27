import { TestBed } from '@angular/core/testing';

import { ChartSeriesFactoryService } from './chart-series-factory.service';

describe('ChartSeriesFactoryService', () => {
  let service: ChartSeriesFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartSeriesFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
