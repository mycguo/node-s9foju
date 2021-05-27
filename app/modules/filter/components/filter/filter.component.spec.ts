import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from '../../../logger/logger-testing/logger-testing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterInputComponent } from '../filter-input/filter-input.component';

@Component({
  template: `
    <nx-filter [formControl]="formControl"></nx-filter>
  `
})
class FilterHostComponent {
  formControl: FormControl = new FormControl();
}

describe('FilterComponent', () => {
  let component: FilterHostComponent;
  let fixture: ComponentFixture<FilterHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule
      ],
      declarations: [
        FilterComponent,
        FilterHostComponent,
        FilterInputComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
