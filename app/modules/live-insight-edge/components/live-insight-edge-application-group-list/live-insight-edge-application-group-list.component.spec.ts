import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeApplicationGroupListComponent } from './live-insight-edge-application-group-list.component';

describe('LiveInsightEdgeApplicationGroupListComponent', () => {
  let component: LiveInsightEdgeApplicationGroupListComponent;
  let fixture: ComponentFixture<LiveInsightEdgeApplicationGroupListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeApplicationGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeApplicationGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
