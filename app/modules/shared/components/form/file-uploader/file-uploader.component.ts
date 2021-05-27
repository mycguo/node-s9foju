import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit, Optional,
  Self, ViewChild
} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {FormValidationMessageService} from '../../../../../services/form-validation-message/form-validation-message.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {filter} from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'nx-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.less']
})
export class FileUploaderComponent implements OnInit, ControlValueAccessor {
  @Input() acceptedFileTypes: Array<string>;
  @ViewChild('fileInput', {static: true}) fileInput;

  file: File;
  disabled: boolean;
  errorMessage: string;
  onChange = (_: File) => void 0;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    this.uploadFile(event);
  }

  /**
   * @ignore
   */
  constructor(@Self() private controlDir: NgControl,
              private cd: ChangeDetectorRef,
              private formValidationMessage: FormValidationMessageService) {
    controlDir.valueAccessor = this;
  }

  ngOnInit() {
    // need change detection b/c of async validator
    this.control.statusChanges
      .pipe(
        untilDestroyed(this),
        filter((status) => status !== 'PENDING'))
      .subscribe(() => {
        this.errorMessage = this.formValidationMessage.getErrorMessage(this.control.errors);
        this.cd.markForCheck();
      });
  }

  get control() {
    return this.controlDir.control;
  }

  uploadFile(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }

  writeValue(value: File) {
    this.fileInput.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: (file: File) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
