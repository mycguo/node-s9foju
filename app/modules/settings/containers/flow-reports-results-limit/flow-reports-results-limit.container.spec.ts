import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowReportsResultsLimitContainer } from './flow-reports-results-limit.container';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FlowReportsResultsLimitService } from '../../services/flow-reports-results-limit/flow-reports-results-limit.service';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('FlowReportsResultLimitContainer', () => {
  let component: FlowReportsResultsLimitContainer;
  let fixture: ComponentFixture<FlowReportsResultsLimitContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        FlowReportsResultsLimitService
      ],
      declarations: [ FlowReportsResultsLimitContainer ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowReportsResultsLimitContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
