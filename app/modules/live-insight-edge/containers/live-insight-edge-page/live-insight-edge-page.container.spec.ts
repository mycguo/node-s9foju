import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgePageContainer } from './live-insight-edge-page.container';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import {IntegrationsModule} from '../../../integrations/integrations.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('LiveInsightEdgePageContainer', () => {
  let component: LiveInsightEdgePageContainer;
  let fixture: ComponentFixture<LiveInsightEdgePageContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IntegrationsModule.forRoot(false),
        LiveInsightEdgeModule.forRoot(false),
        HttpClientTestingModule,
        LoggerTestingModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgePageContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
