import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleAlertComponent} from './simple-alert.component';
import SimpleAlert from './model/simple-alert';
import {SIMPLE_ALERT_TYPE_ENUM} from './model/simple-alert-type.enum';
import {By} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SimpleAlertComponent', () => {
  let component: SimpleAlertComponent;
  let fixture: ComponentFixture<SimpleAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      declarations: [SimpleAlertComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error alert', () => {
    component.alert = new SimpleAlert('Error: ',
      `Error Alert Text`, SIMPLE_ALERT_TYPE_ENUM.ERROR, 999999);

    component.ngOnChanges(void 0);
    fixture.detectChanges();

    const textWrapper = fixture.debugElement.query(By.css('.nx-simple-alert-message-wrapper')).nativeElement;
    expect(textWrapper.innerText).toBe('Error: Error Alert Text');
  });

  it('should show success alert', () => {
    component.alert = new SimpleAlert('Success: ',
      `Success Alert Text`, SIMPLE_ALERT_TYPE_ENUM.SUCCESS, 999999);

    component.ngOnChanges(void 0);
    fixture.detectChanges();

    const textWrapper = fixture.debugElement.query(By.css('.nx-simple-alert-message-wrapper')).nativeElement;

    expect(textWrapper.innerText).toBe('Success: Success Alert Text');
  });
});
