import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCheckMarkCellRendererComponent } from './grid-check-mark-cell-renderer.component';

describe('GridCheckMarkCellRendererComponent', () => {
  let component: GridCheckMarkCellRendererComponent;
  let fixture: ComponentFixture<GridCheckMarkCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCheckMarkCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCheckMarkCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
