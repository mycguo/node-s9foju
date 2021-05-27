import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCellRendererComponent } from './status-cell-renderer.component';

describe('StatusCellRendererComponent', () => {
  let component: StatusCellRendererComponent;
  let fixture: ComponentFixture<StatusCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
