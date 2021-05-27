import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPathCrosslaunchTableComponent } from './flow-path-crosslaunch-table.component';

describe('FlowPathCrosslaunchTableComponent', () => {
  let component: FlowPathCrosslaunchTableComponent;
  let fixture: ComponentFixture<FlowPathCrosslaunchTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPathCrosslaunchTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPathCrosslaunchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
