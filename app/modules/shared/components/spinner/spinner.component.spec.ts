import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {SpinnerComponent} from './spinner.component';
import {SPINNER_SIZE} from './spinnerSize';
import {SPINNER_POSITION} from './spinnerPosition';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have small size class', () => {
    component.spinnerSize = SPINNER_SIZE.SM;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.la-spinner'));
    expect(spinner.classes['la-spinner_size-sm']).toBeTruthy();
  });

  it('should have extra small size class', () => {
    component.spinnerSize = SPINNER_SIZE.XS;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.la-spinner'));
    expect(spinner.classes['la-spinner_size-xs']).toBeTruthy();
  });

  it('should have be positioned absolutely', () => {
    component.spinnerPosition = SPINNER_POSITION.ABSOLUTE;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.spinner-container'));
    expect(spinner.classes['spinner-position_absolute']).toBeTruthy();
  });

  it('should have overlay', () => {
    component.spinnerOverlay = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.spinner-container'));
    expect(spinner.classes['spinner-overlay']).toBeTruthy();
  });
});
