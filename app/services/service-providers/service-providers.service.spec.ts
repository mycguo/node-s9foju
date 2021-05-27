import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProvidersStore } from './service-providers.store';
import {
  NG_ENTITY_SERVICE_CONFIG,
  NgEntityServiceGlobalConfig
} from '@datorama/akita-ng-entity-service';
import {LoggerTestingModule} from '../../modules/logger/logger-testing/logger-testing.module';

describe('ServiceProvidersService', () => {
  let serviceProvidersService: ServiceProvidersService;
  let serviceProvidersStore: ServiceProvidersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceProvidersService,
        ServiceProvidersStore,
        {
          provide: NG_ENTITY_SERVICE_CONFIG,
          useValue: {} as NgEntityServiceGlobalConfig
        }
      ],
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });

    serviceProvidersService = TestBed.get(ServiceProvidersService);
    serviceProvidersStore = TestBed.get(ServiceProvidersStore);
  });

  it('should be created', () => {
    expect(serviceProvidersService).toBeDefined();
  });

});
