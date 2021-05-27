import {TabDirective} from './tab.directive';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';

// Simple test component that will not in the actual app
@Component({
  template: '<ng-template nxTab [tab]="tab"></ng-template>'
})
class TestComponent {
  tab = void 0;

  constructor() {
  }
}

describe('TabDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        TabDirective
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
