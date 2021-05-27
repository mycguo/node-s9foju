import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTooltipComponent } from './grid-tooltip.component';

describe('NxGridTooltipComponent', () => {
  let component: GridTooltipComponent;
  let fixture: ComponentFixture<GridTooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GridTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTooltipComponent);
    component = fixture.componentInstance;
    component.params = {value: ''};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
