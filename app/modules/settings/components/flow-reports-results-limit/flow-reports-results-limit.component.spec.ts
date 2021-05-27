import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowReportsResultsLimitComponent } from './flow-reports-results-limit.component';
import { FormBuilder } from '@angular/forms';

describe('FlowReportsResultLimitComponent', () => {
  let component: FlowReportsResultsLimitComponent;
  let fixture: ComponentFixture<FlowReportsResultsLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FormBuilder],
      declarations: [ FlowReportsResultsLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowReportsResultsLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
