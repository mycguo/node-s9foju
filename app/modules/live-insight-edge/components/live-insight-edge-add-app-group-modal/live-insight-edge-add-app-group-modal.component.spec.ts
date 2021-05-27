import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeAddAppGroupModalComponent } from './live-insight-edge-add-app-group-modal.component';

describe('LiveInsightEdgeAddAppGroupModalComponent', () => {
  let component: LiveInsightEdgeAddAppGroupModalComponent;
  let fixture: ComponentFixture<LiveInsightEdgeAddAppGroupModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInsightEdgeAddAppGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeAddAppGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
