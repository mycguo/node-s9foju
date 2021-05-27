import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SimpleInputModel } from 'src/app/modules/shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from 'src/app/modules/shared/components/form/simple-input/models/html-input-types.enum';
import { Size } from 'src/app/modules/shared/enums/size';
import { ModalActionType } from '../../../shared/enums/modal-action-type.enum';
import { combineLatest, Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomApplicationsService } from '../../services/custom-applications/custom-applications.service';
import { CustomApplicationModalData } from '../../models/custom-application-modal-data';
import { CustomApplicationRequest } from '../../models/custom-application-request';
import { FormValidationService } from '../../../../services/form-validation/form-validation.service';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { NbarApplication } from '../../models/nbar-application';
import { RadioGroup } from '../../../shared/components/form/radio-group/radio-group';
import { RadioOption } from '../../../shared/components/form/radio-group/radio-option';
import DetailedError from '../../../shared/components/loading/detailed-error';
import ChipsInputMultiselectModel from 'src/app/modules/shared/components/form/chips-input/chips-input-multiselect/models/chips-input-multiselect.model';
import ChipsInputTextModel from 'src/app/modules/shared/components/form/chips-input/chips-input-text/models/chips-input-text.model';
import ChipMultiselect from 'src/app/modules/shared/components/form/chips-input/chips-input-multiselect/models/chip-multiselect';
import { DscpType } from '../../models/dscp-type';

enum RadioGroupEnum {
  NETWORK = 'network',
  HTTP = 'http'
}

@UntilDestroy()
@Component({
  selector: 'nx-custom-applications-modal',
  templateUrl: './custom-applications-modal.component.html',
  styleUrls: [
    '../../../../../styles/atomic-stages/templates/__layout/__row-col/layouts__row-col.less',
    '../../../../../styles/utilities/helpers/helpers_state.less'
  ]
})
export class CustomApplicationsModalComponent extends DialogComponent<CustomApplicationModalData, CustomApplicationRequest>
  implements OnInit {
  public readonly NAME_CONTROL_KEY = 'name';
  public readonly DESCRIPTION_CONTROL_KEY = 'description';
  public readonly IP_RANGES_CONTROL_KEY = 'ipRanges';
  public readonly INCLUDE_APPLICATIONS_CONTROL_KEY = 'includeApplication';
  public readonly PORT_RANGES_CONTROL_KEY = 'portRanges';
  public readonly LAYER_PROTOCOL_CONTROL_KEY = 'layerProtocol';
  public readonly DSCP_CONTROL_KEY = 'dscp';
  public readonly HTTP_HOST_CONTROL_KEY = 'httpHost';

  formGroup: FormGroup;

  RADIO_GROUP: typeof RadioGroupEnum = RadioGroupEnum;
  radioGroup = {
    [RadioGroupEnum.NETWORK]: new RadioGroup([new RadioOption(RadioGroupEnum.NETWORK, 'Network attributes')]),
    [RadioGroupEnum.HTTP]: new RadioGroup([new RadioOption(RadioGroupEnum.HTTP, 'HTTP host or SSL common name')])
  };
  radioGroupModel: string = RadioGroupEnum.NETWORK;
  nameInputModel: SimpleInputModel;
  descriptionInputModel: SimpleInputModel;
  portRangesInputModel: SimpleInputModel;
  chipsInputSize: Size;
  isLoading$: Observable<boolean>;
  error$: Observable<DetailedError>;
  applicationSelectionModel: ChipsInputMultiselectModel;
  ipRangesModel: ChipsInputTextModel;
  layerProtocolModel: ChipsInputMultiselectModel;
  dscpModel: ChipsInputMultiselectModel;
  httpHostsModel: ChipsInputTextModel;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent<CustomApplicationModalData, CustomApplicationRequest>>,
    @Inject(MAT_DIALOG_DATA) public data: CustomApplicationModalData,
    private customApplicationsService: CustomApplicationsService,
    private formValidationService: FormValidationService
  ) {
    super(data, dialogRef);
    this.chipsInputSize = Size.MD;
  }

  ngOnInit() {
    this.initFormGroup();
    this.initControlModels();
    this.initObservables();
  }

  get nameControl() {
    return this.formGroup.get(this.NAME_CONTROL_KEY);
  }

  get descriptionControl() {
    return this.formGroup.get(this.DESCRIPTION_CONTROL_KEY);
  }

  get ipRangesControl() {
    return this.formGroup.get(this.IP_RANGES_CONTROL_KEY);
  }

  get includeApplicationControl() {
    return this.formGroup.get(this.INCLUDE_APPLICATIONS_CONTROL_KEY);
  }

  get portRangesControl() {
    return this.formGroup.get(this.PORT_RANGES_CONTROL_KEY);
  }

  get layerProtocolControl() {
    return this.formGroup.get(this.LAYER_PROTOCOL_CONTROL_KEY);
  }

  get dscpControl() {
    return this.formGroup.get(this.DSCP_CONTROL_KEY);
  }

  get httpHostControl() {
    return this.formGroup.get(this.HTTP_HOST_CONTROL_KEY);
  }

  cancel() {
    this.dialogRef.close();
  }

  onSaveClick() {
    const customAppRequest: CustomApplicationRequest = new CustomApplicationRequest({
      name: this.nameControl.value,
      description: this.descriptionControl.value ? this.descriptionControl.value : void 0
    });

    if (this.radioGroupModel === RadioGroupEnum.NETWORK) {
      Object.assign(customAppRequest, {
        ipRanges: this.ipRangesControl.value ?
          this.ipRangesControl.value.map((v: string) => v).filter(Boolean) : void 0,
        portMap: {
          protocols: this.layerProtocolControl.value,
          portRanges: this.portRangesControl.value ?
            this.portRangesControl.value.split('\n').map(v => v.trim()).filter(Boolean) : []
        },
        nbarIds: this.includeApplicationControl.value.map(nbar => parseInt(nbar, 10)),
        dscpTypes: this.dscpControl.value
      });
    } else {
      Object.assign(customAppRequest, {
        urls: this.httpHostControl.value ?
          this.httpHostControl.value.map((v: string) => v).filter(Boolean) : void 0
      });
    }

    switch (this.data.mode) {
      case ModalActionType.ADD:
        this.customApplicationsService.addCustomApplication(customAppRequest)
          .pipe(
            take(1)
          )
          .subscribe(resp => this.dialogRef.close(resp),
            err => this.dialogRef.close(err));
        break;
      case ModalActionType.EDIT:
        this.customApplicationsService.editCustomApplication(this.data.application.id, customAppRequest)
          .pipe(
            take(1)
          )
          .subscribe(resp => this.dialogRef.close(resp),
            err => this.dialogRef.close(err));
        break;
    }
  }

  private initFormGroup(): void {
    if (this.data.application?.urls?.length > 0) {
      this.radioGroupModel = RadioGroupEnum.HTTP;
    }

    this.formGroup = new FormGroup({
      [this.NAME_CONTROL_KEY]: new FormControl(this.data.application?.name, Validators.required),
      [this.DESCRIPTION_CONTROL_KEY]: new FormControl(this.data.application?.description),
      [this.IP_RANGES_CONTROL_KEY]: new FormControl(this.data.application?.ipRanges || []),
      [this.INCLUDE_APPLICATIONS_CONTROL_KEY]: new FormControl(this.data.application?.nbarApps?.map(
        (app: NbarApplication) => app.id) || []
      ),
      [this.LAYER_PROTOCOL_CONTROL_KEY]: new FormControl(this.data.application?.portMap?.protocols || []),
      [this.PORT_RANGES_CONTROL_KEY]: new FormControl(
        this.data.application?.portMap?.portRanges?.join('\n'),
        this.formValidationService.portRange()
      ),
      [this.DSCP_CONTROL_KEY]: new FormControl(this.data.application?.dscpTypes?.map(dscp => dscp.toString(10)) || []),
      [this.HTTP_HOST_CONTROL_KEY]: new FormControl(this.data.application?.urls || [], Validators.required)
    });

    this.onRadioGroupChange(this.radioGroupModel);
  }

  private initControlModels(): void {
    this.nameInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Name',
      'Enter Custom Application Name'
    );

    this.descriptionInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.text,
      'Description',
      'Enter Custom Application Description'
    );

    this.portRangesInputModel = new SimpleInputModel(
      HtmlInputTypesEnum.textArea,
      'Port Ranges',
      'Specify ports or port ranges (ex: 2427-2430), one per line'
    );

    this.applicationSelectionModel = new ChipsInputMultiselectModel({
      label: 'Include Application',
      placeholder: 'Start typing for more results',
      options: []
    });

    this.ipRangesModel = new ChipsInputTextModel({
      label: 'IP Ranges',
      placeholder: 'Specify IPs or IP ranges (ex: 192.168.1.1-192.168.1.200)',
      tagValidators: this.formValidationService.ipRange()
    });

    this.layerProtocolModel = new ChipsInputMultiselectModel({
      label: 'Layer 4 Protocol',
      placeholder: 'Specify protocols. Matches any protocol by default',
      secondaryPlaceholder: 'Select protocol',
      options: this.data.customAppProtocols?.map((protocol: string) => new ChipMultiselect({name: protocol})) || []
    });

    this.dscpModel = new ChipsInputMultiselectModel({
      label: 'DSCP',
      placeholder: 'Specify DSCP classes',
      options: []
    });

    this.httpHostsModel = new ChipsInputTextModel({
      label: 'HTTP host or SSL common name',
      placeholder: 'Enter HTTP host or SSL common name. Ex.: *.webex.com',
      hintMessage: 'You can use wildcards in host names'
    });
  }

  private initObservables(): void {
    this.customApplicationsService.selectNbarApps()
    .pipe(
      untilDestroyed(this),
      map((apps: NbarApplication[]) => {
        return apps.map((app: NbarApplication) => new ChipMultiselect({id: app.id, name: app.name}));
    }))
    .subscribe((options: ChipMultiselect[]) => this.applicationSelectionModel.options = options);

    this.customApplicationsService.selectDscpTypes()
      .pipe(
        untilDestroyed(this),
        map((dscpTypes: DscpType[]) => {
          this.dscpModel.options = dscpTypes.map(dscpType =>
            new ChipMultiselect({id: dscpType.value.toString(10), name: dscpType.name})
          );
        })
      )
      .subscribe();

    this.isLoading$ = combineLatest([
      this.customApplicationsService.selectNbarAppsLoading(),
      this.customApplicationsService.selectDscpLoading()
    ])
      .pipe(
        map(([nbarLoading, dscpLoading]) => nbarLoading && dscpLoading)
      );

    this.error$ = combineLatest([
      this.customApplicationsService.selectNbarAppsError(),
      this.customApplicationsService.selectDscpError()
    ])
      .pipe(
        switchMap(value => value.filter(val => !!val))
      );

    this.customApplicationsService.getNbarApplications()
      .pipe(take(1)).subscribe();

    this.layerProtocolControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value.length === 0) {
          this.portRangesControl.setValue(null);
          this.portRangesControl.disable();
        } else {
          this.portRangesControl.enable();
        }
      });
  }

  onRadioGroupChange(value: string) {
    if (value === RadioGroupEnum.NETWORK) {
      this.httpHostControl.disable();
      this.ipRangesControl.enable();
      this.includeApplicationControl.enable();
      this.layerProtocolControl.enable();
      this.layerProtocolControl.value.length ? this.portRangesControl.enable() : this.portRangesControl.disable();
      this.dscpControl.enable();
    } else {
      this.httpHostControl.enable();
      this.ipRangesControl.disable();
      this.includeApplicationControl.disable();
      this.layerProtocolControl.disable();
      this.portRangesControl.disable();
      this.dscpControl.disable();
    }
  }
}
