import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ChipsInputTextComponent } from './chips-input-text.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChipSetComponent } from '../../../chip-set/chip-set.component';
import ChipsInputTextModel from './models/chips-input-text.model';

@Component({
  template: `
    <nx-chips-input-text
      [formControl]="formControl"
      [chipsInputModel]="inputModel">
    </nx-chips-input-text>`
})
class ChipsInputTextHostComponent {
  formControl = new FormControl([]);
  inputModel = new ChipsInputTextModel({label: 'Test Label'});
}

describe('ChipsInputTextComponent', () => {
  let fixture: ComponentFixture<ChipsInputTextHostComponent>;
  let component: ChipsInputTextComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        ChipsInputTextHostComponent,
        ChipsInputTextComponent,
        ChipSetComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsInputTextHostComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive value', () => {
    fixture.componentInstance.formControl.setValue(['chip1', 'chip2']);
    expect(component.chipSet.toArray().map(chip => chip.getValue())).toEqual(['chip1', 'chip2']);
    fixture.componentInstance.formControl.setValue([]);
    expect(component.chipSet.toArray()).toEqual([]);
    fixture.componentInstance.formControl.setValue(null);
    expect(component.chipSet.size).toBe(0);
  });

  it('should propagate value changes', () => {
    component.addValueHandler('chip1');
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1']);
    component.addValueHandler('chip1, chip2,,,  ,  chip3   , chip4 chip5,  ,,  ,chip3');
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1', 'chip2', 'chip3', 'chip4 chip5']);
    component.removeChips([component.chipSet.toArray()[2]]);
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1', 'chip2', 'chip4 chip5']);
    component.removeChips(component.chipSet.toArray());
    expect(fixture.componentInstance.formControl.value).toEqual([]);
  });

  it('should leave repetitive values and make them unique', () => {
    component.addValueHandler('chip1');
    component.addValueHandler('chip1, chip2,,,  ,  chip3   , chip4 chip5,  ,,  ,chip3,chip2,chip2');
    expect(component.inputValue).toEqual({value: 'chip1,chip3,chip2'});
  });

  it('should validate', () => {
    fixture.componentInstance.formControl.setValidators(Validators.required);
    fixture.componentInstance.formControl.updateValueAndValidity();
    expect(fixture.componentInstance.formControl.valid).toBe(false);
    component.addValueHandler('chip1');
    expect(fixture.componentInstance.formControl.valid).toBe(true);
    fixture.componentInstance.inputModel.tagValidators = [Validators.email, Validators.minLength(6)];
    fixture.componentInstance.inputModel = {...fixture.componentInstance.inputModel};
    fixture.detectChanges();
    component.removeChips(component.chipSet.toArray());
    component.addValueHandler('c@x, chip1@example, chip2@example');
    expect(fixture.componentInstance.formControl.valid).toBe(false);
    component.removeChips([component.chipSet.toArray()[0]]);
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1@example', 'chip2@example']);
    expect(fixture.componentInstance.formControl.valid).toBe(true);
  });

});
