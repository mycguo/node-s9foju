import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeekCellRendererComponent } from './peek-cell-renderer.component';

describe('PeekCellRendererComponent', () => {
  let component: PeekCellRendererComponent;
  let fixture: ComponentFixture<PeekCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeekCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
