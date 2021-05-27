import { TestBed } from '@angular/core/testing';

import { StoreAdapterFactoryService } from './store-adapter-factory.service';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('StoreAdapterFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      LoggerTestingModule
    ]
  }));

  it('should be created', () => {
    const service: StoreAdapterFactoryService = TestBed.get(StoreAdapterFactoryService);
    expect(service).toBeTruthy();
  });
});
