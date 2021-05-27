import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeverityIndicatorComponent } from './severity-indicator.component';

describe('SeverityIndicatorComponent', () => {
  let component: SeverityIndicatorComponent;
  let fixture: ComponentFixture<SeverityIndicatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeverityIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeverityIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
