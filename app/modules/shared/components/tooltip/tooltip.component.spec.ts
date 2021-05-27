import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {TooltipComponent} from './tooltip.component';
import {InfoBtnComponent} from '../info-btn/info-btn.component';

describe('LaTooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipComponent, InfoBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
