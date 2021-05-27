import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterInputComponent } from './filter-input.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from '../../../logger/logger-testing/logger-testing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: `
    <nx-filter-input [formControl]="formControl"></nx-filter-input>
  `
})
class FilterInputHostComponent {
  formControl = new FormControl();
}

describe('FilterInputComponent', () => {
  let component: FilterInputHostComponent;
  let fixture: ComponentFixture<FilterInputHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule
      ],
      declarations: [
        FilterInputComponent,
        FilterInputHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
