import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaComponent } from './textarea.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { MatInputModule } from '@angular/material/input';
import {Component} from '@angular/core';

@Component({
  template: `<nx-textarea></nx-textarea>`
})
class TestComponent {
  formControl = new FormControl();
}

describe('TextareaComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule,
        MatInputModule
      ],
      declarations: [ TextareaComponent ]
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
