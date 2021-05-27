import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextButtonComponent } from './text-button.component';
import { By } from '@angular/platform-browser';

describe('TextButtonComponent', () => {
  let component: TextButtonComponent;
  let fixture: ComponentFixture<TextButtonComponent>;
  let button: HTMLButtonElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      button = fixture.debugElement.query(By.css('button')).nativeElement;
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Declaring 'isDisabled' should disable the button`, waitForAsync(() => {
    let callbackResult = false;
    component.isDisabled = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(button.disabled).toBeTruthy(`Button hasn't 'disabled' attribute`);

      component.btnClick.subscribe(() => callbackResult = true);
      button.click();
      expect(callbackResult).toBeFalsy(`Button do not prevent click event`);
    });
  }));

  it(`'Click' event execute assigned script`, waitForAsync(() => {
    let callbackResult = false;

    fixture.whenStable().then(() => {
      component.btnClick.subscribe(() => callbackResult = true);
      button.click();
      expect(callbackResult).toBeTruthy(`Button do not execute assigned script`);
    });
  }));
});
