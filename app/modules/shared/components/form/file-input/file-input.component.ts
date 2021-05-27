import {
  ControlValueAccessor,
  FormControl,
  NgControl
} from '@angular/forms';
import { Component, HostListener, Input, Self, TemplateRef } from '@angular/core';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';

@Component({
  selector: 'nx-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.less']
})
export class FileInputComponent implements ControlValueAccessor {
  @Input() fileTypes: string[];
  @Input() inputModel: SimpleInputModel;
  @Input() validateOnInit = false; // if validation should be run when pristine
  @Input() headerAdditionalElements: TemplateRef<any>;

  file: File = null;
  fileInputHelperFieldControl: FormControl;
  INPUT_TYPES = HtmlInputTypesEnum;

  private onChange = (file: File) => void 0;
  private onTouch = () => void 0;

  @HostListener('change', ['$event.target.files']) uploadFile(fileList: FileList) {
    this.file = fileList?.item(0);
    this.updateFileName(this.file?.name);
    this.onChange(this.file);
    this.onTouch();
  }

  constructor(@Self() private controlDir: NgControl) {
    controlDir.valueAccessor = this;
    this.fileInputHelperFieldControl = new FormControl();
  }

  get control() {
    return this.controlDir.control;
  }

  private updateFileName(fileName: string): void {
    this.fileInputHelperFieldControl.setValue(fileName, {emitEvent: false, onlySelf: true});
  }

  cleanFile() {
    this.file = null;
    this.updateFileName(null);
    this.onChange(null);
  }

  writeValue(file: File): void {
    this.file = file;
    this.updateFileName(this.file?.name);
  }

  registerOnChange(fn: (file: File) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.fileInputHelperFieldControl.disable({emitEvent: false, onlySelf: true}) :
      this.fileInputHelperFieldControl.enable({emitEvent: false, onlySelf: true});
  }
}
