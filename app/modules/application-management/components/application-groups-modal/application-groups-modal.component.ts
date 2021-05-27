import {Observable} from 'rxjs';
import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {SimpleInputModel} from '../../../shared/components/form/simple-input/models/simple-input.model';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl, ValidationErrors} from '@angular/forms';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import {filter, map, take} from 'rxjs/operators';
import {ApplicationSuggestion} from '../../models/application-suggestion';
import {NotificationLabelStatus} from '../../../shared/components/notification-label/enums/notification-label-status.enum';
import {ApplicationGroupsModalService} from '../../services/application-groups-modal/applicationGroupsModal.service';
import {ApplicationGroupRequest} from '../../models/application-group-request';
import {ApplicationGroupModalData} from '../../models/application-group-modal-data';
import {CommonService} from '../../../../utils/common/common.service';
import ApplicationGroup from '../../models/application-group';
import {ModalActionType} from '../../../shared/enums/modal-action-type.enum';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {DialogComponent} from '../../../shared/components/dialog/dialog.component';
import {Application} from '../../models/application';
import DetailedError from '../../../shared/components/loading/detailed-error';
import ChipsInputMultiselectModel from 'src/app/modules/shared/components/form/chips-input/chips-input-multiselect/models/chips-input-multiselect.model';
import ChipMultiselect from 'src/app/modules/shared/components/form/chips-input/chips-input-multiselect/models/chip-multiselect';

@UntilDestroy()
@Component({
  selector: 'nx-application-groups-modal',
  templateUrl: './application-groups-modal.component.html',
  styleUrls: ['./application-groups-modal.component.less']
})
export class ApplicationGroupsModalComponent extends DialogComponent<ApplicationGroupModalData, ApplicationGroupRequest>
  implements OnInit, OnDestroy {

  public readonly GROUP_NAME_CONTROL_KEY = 'groupName';
  public readonly INCLUDE_APP_CONTROL_KEY = 'includeApp';

  readonly notificationStatus = NotificationLabelStatus.WARNING;
  appInAnotherGroup: boolean;
  formGroup: FormGroup;
  groupNameInputModel: SimpleInputModel;
  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  appGroup: ApplicationGroup;
  applicationSelectionModel: ChipsInputMultiselectModel;

  constructor(private fb: FormBuilder,
              private appGroupsModalService: ApplicationGroupsModalService,
              private commonService: CommonService,
              public dialogRef: MatDialogRef<DialogComponent<ApplicationGroupModalData, ApplicationGroupRequest>>,
              @Inject(MAT_DIALOG_DATA) public data: ApplicationGroupModalData) {
    super(data, dialogRef);
    this.appInAnotherGroup = false;
  }

  ngOnInit() {
    this.initForm();
    this.initObservables();

    if (this.data.mode === ModalActionType.EDIT) {
      this.appGroup = this.data.appGroup;
      this.formGroup.setValue({
        [this.GROUP_NAME_CONTROL_KEY]: this.appGroup.name,
        [this.INCLUDE_APP_CONTROL_KEY]: this.appGroup.applications?.map((app: Application) => app.name) || []
      });
    }
  }

  ngOnDestroy(): void {
    this.appGroupsModalService.reset();
  }

  get groupName() {
    return this.formGroup.get(this.GROUP_NAME_CONTROL_KEY);
  }

  get includeApp() {
    return this.formGroup.get(this.INCLUDE_APP_CONTROL_KEY);
  }

  public cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    const applicationGroupRequest: ApplicationGroupRequest = {
      name: this.groupName.value.trim(),
      applications: this.includeApp.value.map((chip: string) => ({name: chip}))
    };
    switch (this.data.mode) {
      case ModalActionType.ADD: {
        this.appGroupsModalService.addApplicationGroup(applicationGroupRequest)
          .pipe(take(1))
          .subscribe(resp => this.dialogRef.close(resp),
            err => this.dialogRef.close(err));
        break;
      }
      case ModalActionType.EDIT: {
        this.appGroupsModalService.updateApplicationGroup(this.appGroup.id, applicationGroupRequest)
          .pipe(take(1))
          .subscribe(resp => this.dialogRef.close(resp),
            err => this.dialogRef.close(err));
        break;
      }
    }
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      [this.GROUP_NAME_CONTROL_KEY]: '',
      [this.INCLUDE_APP_CONTROL_KEY]: new FormControl([])
    });
    this.groupName.setValidators([Validators.required, this.uniqueAppNameValidator.bind(this)]);
    this.includeApp.setValidators(Validators.required);

    this.groupNameInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Group Name',
      void 0,
      void 0,
      void 0,
      void 0,
      {uniqueGroup: () => 'Group name already exists'}
    );

    this.applicationSelectionModel = new ChipsInputMultiselectModel({
      label: 'Include Application',
      options: [],
      placeholder: 'Start typing for more results',
      allowCustomText: true
    });
  }

  private initObservables(): void {
    this.isLoading$ = this.appGroupsModalService.selectSuggestionsLoading();
    this.error$ = this.appGroupsModalService.selectSuggestionsError();

    this.appGroupsModalService.selectSuggestions()
      .pipe(
        untilDestroyed(this),
        filter(options => options?.length > 0),
        map((options: ApplicationSuggestion[]) => {
          return options.map((option: ApplicationSuggestion) => {
            return new ChipMultiselect({
              name: option.name,
              customTemplateValue: option.groupName === this.appGroup?.name ? void 0 : option.groupName});
          });
        })
      )
      .subscribe((options: ChipMultiselect[]) => this.applicationSelectionModel.options = options);

    this.appGroupsModalService.getApplicationSuggestions()
      .pipe(take(1))
      .subscribe();

    this.includeApp.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((values: string[]) => {
        this.appInAnotherGroup = values.some((value: string) => {
          const option = this.applicationSelectionModel.options.find((o: ChipMultiselect) => o.getValue() === value);
          return !this.commonService.isNil(option?.customTemplateValue);
        });
      });
  }

  private uniqueAppNameValidator(control: FormControl): ValidationErrors | null {
    if (this.commonService.isNil(control.value)) {
      return null;
    }
    // remove current group name from list
    const appGroupNames = this.data.appGroupNames?.filter(name => name !== this.appGroup?.name);
    const hasDupes = appGroupNames?.some(name => name === control.value?.trim());
    if (hasDupes) {
      return {
        uniqueGroup: true
      };
    }
    return null;
  }

}
