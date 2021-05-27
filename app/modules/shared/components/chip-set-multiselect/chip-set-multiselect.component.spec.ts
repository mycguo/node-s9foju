import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighlightPipe } from '../../pipes/highlight/highlight.pipe';
import { ChipSet } from '../chip-set/models/chip-set';
import { ChipComponent } from '../chip/chip.component';
import ChipMultiselect from '../form/chips-input/chips-input-multiselect/models/chip-multiselect';
import { ChipSetMultiselectComponent } from './chip-set-multiselect.component';
import { EscapeSpecialCharsPipe } from '../../pipes/escape-special-chars/escape-special-chars.pipe';

@Component({
  template: `
    <nx-chip-set-multiselect
      [chips]="chipSet"
      [options]="autocomplete">
    </nx-chip-set-multiselect>`
})
class ChipSetMultiSelectHostComponent {
  chipSet: ChipSet<ChipMultiselect>;
  autocomplete: ChipMultiselect[];
}

describe('ChipSetMultiselectComponent', () => {
  let component: ChipSetMultiselectComponent;
  let fixture: ComponentFixture<ChipSetMultiSelectHostComponent>;

  let chips: ChipSet<ChipMultiselect>;
  let chip1: ChipMultiselect;
  let chip2: ChipMultiselect;
  let chip3: ChipMultiselect;
  let chip4: ChipMultiselect;

  let autocomplete: ChipMultiselect[];
  let option1: ChipMultiselect;
  let option2: ChipMultiselect;
  let option3: ChipMultiselect;
  let option4: ChipMultiselect;

  beforeEach(waitForAsync(() => {
    chips = new ChipSet<ChipMultiselect>();
    chip1 = chips.add(new ChipMultiselect({name: 'Value0'}));
    chip2 = chips.add(new ChipMultiselect({name: 'Value1'}));
    chip3 = chips.add(new ChipMultiselect({name: 'Value2'}));
    chip4 = chips.add(new ChipMultiselect({name: 'Value3'}));

    option1 = new ChipMultiselect({name: 'Value1'});
    option2 = new ChipMultiselect({name: 'Value55'});
    option3 = new ChipMultiselect({name: 'Value3'});
    option4 = new ChipMultiselect({name: 'Value101'});
    autocomplete = [option1, option2, option3, option4];

    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ChipSetMultiselectComponent,
        ChipComponent,
        ChipSetMultiSelectHostComponent,
        HighlightPipe,
      ],
      providers: [
        EscapeSpecialCharsPipe,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipSetMultiSelectHostComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter options', waitForAsync(() => {
    fixture.componentInstance.autocomplete = autocomplete;
    fixture.componentInstance.chipSet = chips;
    fixture.detectChanges();
    expect(component.autocompleteOptions).toEqual([option2, option4]);
    fixture.componentInstance.autocomplete = null;
    fixture.componentInstance.chipSet = null;
    fixture.detectChanges();
    fixture.componentInstance.chipSet = chips;
    fixture.componentInstance.autocomplete = autocomplete;
    fixture.detectChanges();
    expect(component.autocompleteOptions).toEqual([option2, option4]);
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = '1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.autocompleteOptions).toEqual([option4]);
    });
  }));

  it('should open autocomplete on click', waitForAsync(() => {
    fixture.componentInstance.autocomplete = autocomplete;
    fixture.detectChanges();
    const inputBody: DebugElement = fixture.debugElement.query(By.css('.nx-chips-input__body'));
    inputBody.nativeElement.dispatchEvent(new Event('click'));
    inputBody.triggerEventHandler('focus', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.autocompleteTrigger.panelOpen).toBe(true);
    });
  }));

  it('should open autocomplete on focus', waitForAsync(() => {
    fixture.componentInstance.autocomplete = autocomplete;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.autocompleteTrigger.panelOpen).toBe(true);
    });
  }));

  it('should not open autocomplete with no options', waitForAsync(() => {
    fixture.componentInstance.chipSet = chips;
    fixture.detectChanges();
    const inputBody = fixture.debugElement.query(By.css('.nx-chips-input__body')).nativeElement;
    inputBody.dispatchEvent(new Event('click'));
    fixture.whenStable().then(() => {
      expect(component.autocompleteTrigger.panelOpen).toBe(false);
    });
  }));

  it('should not open autocomplete with all options are selected', waitForAsync(() => {
    fixture.componentInstance.chipSet = new ChipSet();
    fixture.componentInstance.chipSet.withArray([...chips.toArray(), option2, option4]);
    fixture.componentInstance.autocomplete = autocomplete;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new Event('focus'));
    fixture.whenStable().then(() => {
      expect(component.autocompleteTrigger.panelOpen).toBe(false);
    });
  }));

  it('should emit addOption', () => {
    spyOn(component.addOption, 'emit');
    component.selectOption(option1);
    expect(component.addOption.emit).toHaveBeenCalledWith(option1);
  });
});
