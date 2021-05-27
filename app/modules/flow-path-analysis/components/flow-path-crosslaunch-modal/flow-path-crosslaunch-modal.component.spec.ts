import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPathCrosslaunchModalComponent } from './flow-path-crosslaunch-modal.component';

describe('FlowPathCrosslaunchModalComponent', () => {
  let component: FlowPathCrosslaunchModalComponent;
  let fixture: ComponentFixture<FlowPathCrosslaunchModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPathCrosslaunchModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPathCrosslaunchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
