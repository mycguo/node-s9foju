import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTypeCellRendererComponent } from './alert-type-cell-renderer.component';

describe('AlertTypeCellRendererComponent', () => {
  let component: AlertTypeCellRendererComponent;
  let fixture: ComponentFixture<AlertTypeCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTypeCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTypeCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
