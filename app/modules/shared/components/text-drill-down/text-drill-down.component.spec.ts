import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextDrillDownComponent } from './text-drill-down.component';

describe('TextDrillDownComponent', () => {
  let component: TextDrillDownComponent;
  let fixture: ComponentFixture<TextDrillDownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextDrillDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextDrillDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
