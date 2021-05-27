import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeAddApplicationGroupModalContainer } from './live-insight-edge-add-application-group-modal.container';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RequestErrorsSimpleAlertPipe} from '../../../shared/pipes/request-errors-simple-alert/request-errors-simple-alert.pipe';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeAddApplicationGroupModalContainer', () => {
  let component: LiveInsightEdgeAddApplicationGroupModalContainer;
  let fixture: ComponentFixture<LiveInsightEdgeAddApplicationGroupModalContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
      ],
      declarations: [ LiveInsightEdgeAddApplicationGroupModalContainer, RequestErrorsSimpleAlertPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeAddApplicationGroupModalContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
