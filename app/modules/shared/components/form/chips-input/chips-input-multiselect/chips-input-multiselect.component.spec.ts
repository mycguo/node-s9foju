import { Component} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighlightPipe } from 'src/app/modules/shared/pipes/highlight/highlight.pipe';
import { ChipSetComponent } from '../../../chip-set/chip-set.component';
import { ChipsInputMultiselectComponent } from './chips-input-multiselect.component';
import ChipMultiselect from './models/chip-multiselect';
import ChipsInputMultiselectModel from './models/chips-input-multiselect.model';

@Component({
  template: `
    <nx-chips-input-multiselect
      [formControl]="formControl"
      [chipsInputModel]="inputModel">
    </nx-chips-input-multiselect>`
})
class ChipsInputMultiSelectHostComponent {
  formControl = new FormControl(null);
  inputModel = new ChipsInputMultiselectModel({label: 'Test Label', options: []});
}

describe('ChipsInputMultiSelectComponent', () => {
  let fixture: ComponentFixture<ChipsInputMultiSelectHostComponent>;
  let component: ChipsInputMultiselectComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ChipsInputMultiselectComponent,
        ChipsInputMultiSelectHostComponent,
        ChipSetComponent,
        HighlightPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsInputMultiSelectHostComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an option', () => {
    component.addOption(new ChipMultiselect({name: 'chip1'}));
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1']);
    component.addOption(new ChipMultiselect({id: 'chip2', name: 'Chip 2'}));
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1', 'chip2']);
  });

  it('should add option with the same name but different id', () => {
    component.addOption(new ChipMultiselect({name: 'chip1'}));
    component.addOption(new ChipMultiselect({id: 'chip2', name: 'chip1'}));
    expect(fixture.componentInstance.formControl.value).toEqual(['chip1', 'chip2']);
  });
});
