import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgePageComponent } from './live-insight-edge-page.component';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import { MatDialogModule } from '@angular/material/dialog';

describe('LiveInsightEdgePageComponent', () => {
  let component: LiveInsightEdgePageComponent;
  let fixture: ComponentFixture<LiveInsightEdgePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LiveInsightEdgeModule.forRoot(false), MatDialogModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
