import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsPlatformContainer } from './analytics-platform.container';
import {IntegrationsModule} from '../../integrations.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('AnalyticsPlatformContainer', () => {
  let component: AnalyticsPlatformContainer;
  let fixture: ComponentFixture<AnalyticsPlatformContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IntegrationsModule.forRoot(false),
        HttpClientTestingModule,
        LoggerTestingModule,
      ],
      declarations: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsPlatformContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
