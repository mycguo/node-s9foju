import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeCellRendererComponent } from './datetime-cell-renderer.component';

describe('DatetimeCellRendererComponent', () => {
  let component: DatetimeCellRendererComponent;
  let fixture: ComponentFixture<DatetimeCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatetimeCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
