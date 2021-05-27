import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatMenuModule} from '@angular/material/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DropdownComponent } from './dropdown.component';
import {By} from '@angular/platform-browser';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownComponent ],
      imports: [ BrowserAnimationsModule, MatMenuModule ]
    })
    .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should display text in the button', waitForAsync(() => {
    fixture.whenStable().then(() => {
      const buttonText = 'Toggle Dropdown';
      component.buttonText = buttonText;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('nx-button')).nativeElement.textContent.trim()).toBe(buttonText);
    });
  }));
});
