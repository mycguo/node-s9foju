import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {SdwanHttpHeaderListComponent} from './sdwan-http-header-list.component';
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  template: `
    <nx-sdwan-header-list [formControl]="formControl"></nx-sdwan-header-list>`
})
class TestComponent {
  formControl = new FormControl();
}

describe('SdwanHeaderFormComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SdwanHttpHeaderListComponent,
        TestComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
