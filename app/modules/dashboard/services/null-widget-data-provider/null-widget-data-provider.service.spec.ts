import { TestBed } from '@angular/core/testing';

import { NullWidgetDataProviderService } from './null-widget-data-provider.service';

describe('NullWidgetDataProviderService', () => {
  let service: NullWidgetDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NullWidgetDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
