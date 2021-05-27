import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitcherComponent } from './switcher.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { Component } from '@angular/core';
import SwitcherModel from './models/switcher.model';

@Component({
  selector: 'switcher-host',
  template: `
    <nx-switcher
      [switcherModel]="toggleModel"
      [formControl]="control"
    ></nx-switcher>
  `
})
class SwitcherHostComponent {
  control = new FormControl('first');
  toggleModel = new SwitcherModel([
    {
      name: 'first',
      displayValue: 'First'
    },
    {
      name: 'second',
      displayValue: 'Second'
    }
  ]);
}

describe('SwitcherComponent', () => {
  let component: SwitcherHostComponent;
  let fixture: ComponentFixture<SwitcherHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ SwitcherHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitcherHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
