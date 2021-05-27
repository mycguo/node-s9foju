import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalLegendComponent } from './horizontal-legend.component';

describe('HorizontalLegendComponent', () => {
  let component: HorizontalLegendComponent;
  let fixture: ComponentFixture<HorizontalLegendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
