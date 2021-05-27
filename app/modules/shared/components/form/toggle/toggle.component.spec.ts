import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleComponent } from './toggle.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToggleModel } from './models/toggle.model';
import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <nx-toggle id="toggle"
               [toggleModel]="toggleModel"
               [formControl]="control"></nx-toggle>
  `
})
class ToggleHostComponent {
  control = new FormControl(false);
  toggleModel = new ToggleModel('On', 'Off');
}

describe('ToggleComponent', () => {
  let component: ToggleHostComponent;
  let fixture: ComponentFixture<ToggleHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ToggleHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be toggle value', () => {
    expect(component.control.value).toBeFalsy();

    const input = fixture.debugElement.query(By.css('.nx-toggle-checkbox')).nativeElement;
    input.click();
    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        expect(component.control.value).toBeTruthy();
      });
  });
});
