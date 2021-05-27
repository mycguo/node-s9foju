import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {InfoBtnComponent} from './info-btn.component';
import {TooltipComponent} from '../tooltip/tooltip.component';

describe('LaInfoBtnComponent', () => {
  let component: InfoBtnComponent;
  let fixture: ComponentFixture<InfoBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBtnComponent, TooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
