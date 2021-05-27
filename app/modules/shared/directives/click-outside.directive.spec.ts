import { ClickOutsideDirective } from './click-outside.directive';
import {Component} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

@Component({
  template: `<div nxClickOutside outputId="customClick" (clickOutside)="handleClickOutside($event)"></div>`
})
class TestClickOutsideComponent {
  public outsideClickValue = null;
  handleClickOutside(event) {
    this.outsideClickValue = event;
  }
}

describe('ClickOutsideDirective', () => {

  let component: TestClickOutsideComponent;
  let fixture: ComponentFixture<TestClickOutsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestClickOutsideComponent,
        ClickOutsideDirective
      ]
    });
    fixture = TestBed.createComponent(TestClickOutsideComponent);
    component = fixture.componentInstance;
  });

  it('should emit a clicked event when the document is clicked', fakeAsync(() => {
    fixture.detectChanges();
    document.dispatchEvent(new MouseEvent('click'));
    expect(component.outsideClickValue.outputId).toBe('customClick');
  }));

  it('should not emit an event if the host element is clicked', fakeAsync(() => {
    const directiveComponent = fixture.debugElement.query(By.directive(ClickOutsideDirective));
    fixture.detectChanges();
    directiveComponent.nativeElement.click();
    expect(component.outsideClickValue).toBe(null);
  }));
});
