import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';
import DetailedError from '../../../shared/components/loading/detailed-error';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import { BASE_INTEGERS } from '../../../../constants/base-integers.enum';

const REPORTS_LIMIT_DEFAULT = 1000;

@Component({
  selector: 'nx-flow-reports-result-limit',
  templateUrl: './flow-reports-results-limit.component.html',
  styleUrls: ['./flow-reports-results-limit.component.less']
})
export class FlowReportsResultsLimitComponent implements OnInit, OnChanges {

  @Input() isLoading: boolean;
  @Input() error: DetailedError;
  @Input() maxReturnSize: number;

  @Output() submit = new EventEmitter<number>();

  REPORTS_LIMIT_KEY = 'reportsLimit';

  formGroup: FormGroup;
  inputModel: SimpleInputModel;

  constructor(
    private fb: FormBuilder
  ) { }

  get reportsLimitValue(): string {
    return this.formGroup.get(this.REPORTS_LIMIT_KEY).value;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.maxReturnSize?.currentValue !== void 0) {
      this.formGroup.setValue({
        [this.REPORTS_LIMIT_KEY]: this.maxReturnSize
      });
      this.formGroup.markAsPristine();
    }
  }

  submitChanges(): void {
    this.submit.emit(parseInt(this.reportsLimitValue, 10));
    this.formGroup.markAsPristine(); // disable apply button after submit
  }

  resetToDefault(): void {
    this.formGroup.setValue({
      [this.REPORTS_LIMIT_KEY]: REPORTS_LIMIT_DEFAULT
    });
  }

  private initForm(): void {
    this.inputModel = new SimpleInputModel(
      HtmlInputTypesEnum.number,
      'Reports Results Limit',
      void 0,
      void 0,
      void 0,
      void 0,
      {min: () => 'Reports results limit can\'t be lower than 1000' }
    );

    this.formGroup = this.fb.group({
      [this.REPORTS_LIMIT_KEY]: ['', [
        Validators.required,
        Validators.min(REPORTS_LIMIT_DEFAULT),
        Validators.max(BASE_INTEGERS.MAX_JAVA_INTEGER)
      ]]
    });
  }

}
