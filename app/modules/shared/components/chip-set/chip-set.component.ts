import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Colorable} from '../../interfaces/colorable';
import {ToString} from '../../interfaces/to-string';
import {Size} from '../../enums/size';
import {ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import { fadeAnimation } from '../../../../animations/fade.animation';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ChipSet} from './models/chip-set';
import {GetValue} from '../../interfaces/get-value';

@UntilDestroy()
@Component({
  selector: 'nx-chip-set',
  templateUrl: './chip-set.component.html',
  styleUrls: ['./chip-set.component.less'],
  animations: fadeAnimation
})
export class ChipSetComponent<T extends Colorable & ToString & GetValue> implements OnChanges, OnInit, OnDestroy {

  @Input() chips: ChipSet<T>;
  @Input() placeholder: string;
  @Input() size: Size;
  @Input() isDisabled: boolean;
  @Input() set inputValue(inputValue: {value: string}) {
    if (inputValue.value !== this.inputCtrl.value) {
      this.inputCtrl.setValue(inputValue.value || '');
    }
  }

  @Output() addValue = new EventEmitter<string>();
  @Output() deleteChips = new EventEmitter<Array<T>>();
  @Output() touched = new EventEmitter<void>();

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipsInputBody') chipsInputBody: ElementRef<HTMLDivElement>;

  inputCtrl: FormControl;
  readonly SEPARATOR_KEY_CODES = [ENTER];

  constructor() {
    this.inputCtrl = new FormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chips?.currentValue && this.chipsInputBody) {
      this.chipsInputBody.nativeElement.scrollTop = this.chipsInputBody.nativeElement.scrollHeight;
    }
  }

  ngOnInit(): void {
    this.chpSetInit();
  }

  ngOnDestroy(): void {}

  protected chpSetInit(): void {
    this.inputCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.chips?.peek()?.color.deselect());
  }

  onBlur() {
    this.chips?.peek()?.color.deselect();
    this.touched.emit();
    this.addValue.emit(this.inputCtrl.value);
    this.inputCtrl.setValue('');
  }

  onBodyClick() {
    this.chipsInputBody.nativeElement.scrollTop = this.chipsInputBody.nativeElement.scrollHeight;
    this.chipInput.nativeElement.focus();
  }

  onAddValue() {
    this.addValue.emit(this.inputCtrl.value);
  }

  onBackspace(): void {
    if (this.inputCtrl.value || this.chips.size === 0) {
      return;
    }
    const lastChip: T = this.chips.peek();
    if (!lastChip.color.isSelected()) {
      lastChip.color.select();
    } else {
      this.deleteChips.emit([lastChip]);
    }
  }

  removeAllChips(): void {
    this.deleteChips.emit(this.chips.toArray());
    this.touched.emit();
  }

}
