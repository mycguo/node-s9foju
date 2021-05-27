import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import LogoManagementModalDataInterface from './logo-management-modal-data.interface';
import {BaseContainer} from '../../../../containers/base-container/base.container';
import {LogosService} from '../../services/logos/logos.service';
import SimpleAlert from '../../../shared/components/simple-alert/model/simple-alert';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {FormValidationService} from '../../../../services/form-validation/form-validation.service';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import DetailedError from '../../../shared/components/loading/detailed-error';
import { DisplayError } from '../../../shared/components/loading/enums/display-error.enum';
import {Logger} from '../../../logger/logger';

interface LogoManagementModalState {
  previewUrl: string;
}

@UntilDestroy()
@Component({
  selector: 'nx-logo-management-modal',
  templateUrl: './logo-management-modal.component.html',
  styleUrls: ['./logo-management-modal.component.less']
})
export class LogoManagementModalComponent extends BaseContainer<LogoManagementModalState> implements OnInit, OnDestroy {
  static readonly FILE_KEY = 'file';
  static readonly NAME_KEY = 'name';

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() data: LogoManagementModalDataInterface;

  @Output() save = new EventEmitter<LogoManagementModalDataInterface>();
  @Output() close = new EventEmitter<void>();

  readonly prefixLogoUrl = LogosService.PREFIX_LOGO_FILE_URL;
  readonly postfixLogoUrl = LogosService.POSTFIX_LOGO_FILE_URL;

  formGroup: FormGroup;

  nameInputModel: SimpleInputModel;

  state: LogoManagementModalState;
  alertMessageOverride = new SimpleAlert('Error: ', void 0);
  errMsgType = DisplayError.BOTTOM;

  /**
   * @ignore
   */
  constructor(private fb: FormBuilder,
              private logger: Logger,
              private formValidationService: FormValidationService,
              cd: ChangeDetectorRef) {
    super(cd);
    this.state = {
      previewUrl: null
    };
  }

  get staticFileKey() {
    return LogoManagementModalComponent.FILE_KEY;
  }

  get staticNameKey() {
    return LogoManagementModalComponent.NAME_KEY;
  }

  get modalTitle(): string { return `${this.data && this.data.id ? 'EDIT' : 'ADD'} LOGO`; }

  /**
   * set values of form if available
   */
  ngOnInit() {
    this.formGroup = this.fb.group({
      [LogoManagementModalComponent.FILE_KEY]: [this.data.file,
        this.getFileValidations(!this.data.id),
        [this.formValidationService.asyncImage(this.data.logosConfig.fileSize, this.data.logosConfig.ratio)]],
      [LogoManagementModalComponent.NAME_KEY]: [this.data.name, [Validators.required, this.formValidationService.invalidName(new RegExp(`^${LogosService.NO_CUSTOM_LOGO}$`, 'i'))]]
    });

    this.nameInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Logo Name',
      'Enter Logo Name');

    if (this.data.file !== void 0) {
      this.formGroup.markAsDirty();
      this.setImagePreviewUrl(this.data.file);
    } else {
      this.setState({previewUrl: `${this.prefixLogoUrl}${this.data.id}${this.postfixLogoUrl}?${this.data.lastLogoUpdateTime}`});
    }

    this.formGroup.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((form: { file: File }) => {
      this.setImagePreviewUrl(form.file);
    });
  }

  ngOnDestroy(): void {
  }

  /**
   * close dialog
   */
  onClose(): void {
    this.close.emit();
  }

  onSave() {
    const logoForm: LogoManagementModalDataInterface = this.formGroup.value;
    if (this.data.id) {
      logoForm.id = this.data.id;
    }
    this.save.emit(logoForm);
  }

  setImagePreviewUrl(file: File): void {
    if (file != null) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: ProgressEvent) => {
        this.setState({previewUrl: <string>(<FileReader>event.target).result});
      };
    }
  }

  getFileValidations(isNew): Array<ValidatorFn> {
    const validators: Array<ValidatorFn> = [this.formValidationService.requireFileTypes(this.data.logosConfig.fileTypes)];
    if (isNew) {
      validators.push(Validators.required);
    }
    return validators;
  }
}
