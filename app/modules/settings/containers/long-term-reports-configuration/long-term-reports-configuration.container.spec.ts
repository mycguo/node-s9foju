import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermReportsConfigurationContainer } from './long-term-reports-configuration.container';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LongTermReportsService } from '../../services/long-term-reports/long-term-reports.service';
import { NG_ENTITY_SERVICE_CONFIG, NgEntityServiceGlobalConfig } from '@datorama/akita-ng-entity-service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LongTermReportsConfigurationContainer', () => {
  let component: LongTermReportsConfigurationContainer;
  let fixture: ComponentFixture<LongTermReportsConfigurationContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        LongTermReportsService,
        {
          provide: NG_ENTITY_SERVICE_CONFIG,
          useValue: {baseUrl: '/api'} as NgEntityServiceGlobalConfig
        }
      ],
      declarations: [ LongTermReportsConfigurationContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermReportsConfigurationContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
