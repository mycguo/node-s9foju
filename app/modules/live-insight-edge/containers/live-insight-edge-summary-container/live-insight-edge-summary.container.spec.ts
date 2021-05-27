import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {LiveInsightEdgeSummaryContainer} from './live-insight-edge-summary.container';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeSummaryContainer', () => {
  let component: LiveInsightEdgeSummaryContainer;
  let fixture: ComponentFixture<LiveInsightEdgeSummaryContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [ LiveInsightEdgeSummaryContainer ],
      providers: [
        CookieService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeSummaryContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
