import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LongTermReportsService} from './long-term-reports.service';
import {
  NG_ENTITY_SERVICE_CONFIG,
  NgEntityServiceGlobalConfig
} from '@datorama/akita-ng-entity-service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LongTermReportsService', () => {
  let longTermReportsService: LongTermReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LongTermReportsService,
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

    longTermReportsService = TestBed.inject(LongTermReportsService);
  });

  it('should be created', () => {
    expect(longTermReportsService).toBeDefined();
  });

});
