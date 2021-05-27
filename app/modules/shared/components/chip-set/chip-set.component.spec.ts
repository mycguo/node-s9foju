import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {ToString} from '../../interfaces/to-string';
import {Colorable} from '../../interfaces/colorable';
import {Color} from '../../../../models/color';
import {ComponentBgColorClassEnum} from 'src/app/constants/component-bg-color-class.enum';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {ChipSetComponent} from './chip-set.component';
import {ChipComponent} from '../chip/chip.component';
import { GetValue } from '../../interfaces/get-value';
import { By } from '@angular/platform-browser';
import { ChipSet } from './models/chip-set';

class SampleData implements ToString, Colorable, GetValue {
  value: string;
  color: Color;

  constructor(value: string, color?: Color) {
    this.value = value;
    this.color = color || new Color(ComponentBgColorClassEnum.NORMAL);
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}

describe('ChipSetComponent', () => {
  let fixture: ComponentFixture<ChipSetComponent<any>>;
  let component: ChipSetComponent<SampleData>;
  let set1: ChipSet<SampleData>;
  let dat1: SampleData;
  let dat2: SampleData;
  let dat3: SampleData;
  let dat4: SampleData;

  beforeEach(waitForAsync(() => {
    set1 = new ChipSet<SampleData>();
    dat1 = set1.add(new SampleData('Value0'));
    dat2 = set1.add(new SampleData('Value1'));
    dat3 = set1.add(new SampleData('Value2'));
    dat4 = set1.add(new SampleData('Value3'));

    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ChipSetComponent,
        ChipComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input value', () => {
    component.inputValue = {value: 'example'};
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.value).toBe('example');
    component.inputValue = {value: null};
    expect(input.value).toBe('');
  });

  it('should emit addValue', () => {
    spyOn(component.addValue, 'emit');
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'example value, test';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('matChipInputTokenEnd'));
    expect(component.addValue.emit).toHaveBeenCalledWith('example value, test');
  });

  it('should keep value in the input', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'example value, test';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('matChipInputTokenEnd'));
    expect(input.value).toBe('example value, test');
  });

  it('should make last chip selected on backspace', () => {
    component.chips = set1;
    fixture.detectChanges();
    component.onBodyClick();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'backspace'}));
    expect(component.chips.peek().color.value).toBe(ComponentBgColorClassEnum.NORMAL_SELECTED);
  });

  it('should emit deleteChips with last chip', () => {
    spyOn(component.deleteChips, 'emit');
    component.chips = set1;
    component.chips.peek().color.value = ComponentBgColorClassEnum.NORMAL_SELECTED;
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'backspace'}));
    expect(component.deleteChips.emit).toHaveBeenCalledWith([component.chips.peek()]);
  });

  it('should emit array with a chip', () => {
    spyOn(component.deleteChips, 'emit');
    component.chips = set1;
    fixture.detectChanges();
    const chip = Array.from(document.querySelectorAll('nx-chip'))[2];
    chip.dispatchEvent(new Event('delete'));
    expect(component.deleteChips.emit).toHaveBeenCalledWith([dat3]);
  });

  it('should emit deleteChips with all chips', () => {
    spyOn(component.deleteChips, 'emit');
    component.chips = set1;
    fixture.detectChanges();
    const delBtn = fixture.debugElement.query(By.css('.nx-chips-input__clear-btn')).nativeElement;
    delBtn.dispatchEvent(new Event('click'));
    expect(component.deleteChips.emit).toHaveBeenCalledWith(set1.toArray());
  });

  it('should emit touched', () => {
    spyOn(component.touched, 'emit');
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.touched.emit).toHaveBeenCalledWith();
    component.chips = set1;
    fixture.detectChanges();
    const delBtn = fixture.debugElement.query(By.css('.nx-chips-input__clear-btn')).nativeElement;
    delBtn.dispatchEvent(new Event('click'));
    expect(component.touched.emit).toHaveBeenCalledWith();
  });

  it('should not emit touched', () => {
    spyOn(component.touched, 'emit');
    component.chips = set1;
    fixture.detectChanges();
    expect(component.touched.emit).not.toHaveBeenCalled();
  });

  it('should be focused', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    spyOn(input, 'focus');
    const inputBody = fixture.debugElement.query(By.css('.nx-chips-input__body')).nativeElement;
    inputBody.dispatchEvent(new Event('click'));
    expect(input.focus).toHaveBeenCalled();
  });

});
