import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeSummaryComponent } from './live-insight-edge-summary.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CookieService} from 'ngx-cookie-service';
import {ReactiveFormsModule} from '@angular/forms';
import { TitleBarComponent } from '../../../shared/components/title-bar/title-bar.component';
import {FilterModule} from '../../../filter/filter.module';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgeSummaryComponent', () => {
  let component: LiveInsightEdgeSummaryComponent;
  let fixture: ComponentFixture<LiveInsightEdgeSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        FilterModule,
      ],
      declarations: [
        LiveInsightEdgeSummaryComponent,
        TitleBarComponent,
      ],
      providers: [
        CookieService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
