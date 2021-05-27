import { NodeDataStoreSettings } from './node-data-store-settings.interface';
import { DataManagementNodeConfigRecord } from '../../services/data-management/interfaces/data-management-node-config-record';
import { UnitConversionUtilities } from '../../../../services/unit-conversion-utilities/unit-conversion-utilities.service';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataStoreType } from '../../services/data-management/enums/data-store-type.enum';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioOption } from '../../../shared/components/form/radio-group/radio-option';
import { RadioGroup } from '../../../shared/components/form/radio-group/radio-group';
import { CommonService } from '../../../../utils/common/common.service';
import SizeUnitsEnum from '../../../shared/enums/size-units.enum';
import { DataManagementService } from '../../services/data-management/data-management.service';
import { TaskTypes } from '../../services/data-management/enums/task-types.enum';
import { NodeTaskRequest } from './node-task-request';
import NODES_SORT_ORDER from '../../services/data-management/const/nodes-sort-order.const';
import { NodeStates } from '../../services/data-management/enums/node-sates.enum';
import { NodeDataStoreSettingsKeys } from './node-data-store-settings-keys.enum';

enum NodeSettingsTypes {
  DEFAULT = 'default',
  CUSTOM = 'custom'
}

@Component({
  selector: 'nx-node-data-store-settings',
  templateUrl: './node-data-store-settings.component.html',
  styleUrls: ['./node-data-store-settings.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NodeDataStoreSettingsComponent),
      multi: true
    }
  ],
})
export class NodeDataStoreSettingsComponent implements OnInit, OnChanges {

  @Input() settings: NodeDataStoreSettings;
  @Input() isLoading: boolean;
  @Input() taskLoading: boolean;
  @Output() applySettings: EventEmitter<NodeDataStoreSettings> = new EventEmitter<NodeDataStoreSettings>();
  @Output() taskRequest = new EventEmitter<NodeTaskRequest>();

  public readonly DEFAULT_NODE_ID = DataManagementService.DEFAULT_NODE_ID;
  public readonly NODE_SETTINGS_TYPES = NodeSettingsTypes;
  public readonly NODE_STATES = NodeStates;

  // "Settings type" radio-group form control
  public nodeSettingsTypeControl: FormControl;

  // "Settings type" radio-group data
  public nodeSettingsTypeRadioGroup: RadioGroup;

  // List of the node settings groups data
  public dataStoreSettings: DataManagementNodeConfigRecord[];

  // Node settings form
  public nodeDataStoreSettingsForm: FormGroup;

  // Define if custom node selected
  public isCustomNodeSelected: boolean;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private dataUnitsScaleService: UnitConversionUtilities,
    private dataManagement: DataManagementService,
  ) {}

  ngOnInit(): void {
    this.dataStoreSettings = this.getConvertedSettingsValues(this.settings?.dataStoreSettings, false);
    this.isCustomNodeSelected = this.settings?.node?.id !== this.DEFAULT_NODE_ID;
    if (this.isCustomNodeSelected) {
      this.initNodeSettingsTypeRadioGroup(this.settings?.node?.useDefaultSettings);
    }

    this.nodeDataStoreSettingsForm = this.getNodeDataStoreSettingsFormInitValue(this.settings?.dataStoreSettings);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.commonService.isNil(changes?.settings?.currentValue) &&
      !changes?.settings?.isFirstChange()
    ) {
      this.isCustomNodeSelected = this.settings?.node?.id !== this.DEFAULT_NODE_ID;
      this.updateFormElementsData();
    }
  }

  private updateFormElementsData(): void {
    if (this.settings) {

      // Update the "settings type" radio-group value if the specific node custom settings are displayed
      if (this.settings.node?.id !== this.DEFAULT_NODE_ID) {

        // Update the "settings type" radio-group form control value
        this.updateSettingsTypeControlValue(this.settings.node?.useDefaultSettings);
      }

      this.updateDataStoreSettingsFormValue();
    }
  }

  // Init the "settings type" radio-group
  private initNodeSettingsTypeRadioGroup(useDefaultSettings: boolean): void {
    this.nodeSettingsTypeControl = new FormControl(useDefaultSettings ? NodeSettingsTypes.DEFAULT : NodeSettingsTypes.CUSTOM);
    this.nodeSettingsTypeRadioGroup = new RadioGroup([
      new RadioOption(NodeSettingsTypes.DEFAULT, 'Use default settings for this node'),
      new RadioOption(NodeSettingsTypes.CUSTOM, 'Use custom settings')
    ]);
  }

  private getNodeDataStoreSettingsFormInitValue(dataStoreSettings: DataManagementNodeConfigRecord[]): FormGroup {
    const dataStoreSettingsControlValue = {};
    dataStoreSettings?.forEach(settings => {
      dataStoreSettingsControlValue[settings.dataStoreType] = new FormControl();
    });

    return this.fb.group(dataStoreSettingsControlValue);
  }

  private updateSettingsTypeControlValue(useDefaultNodeDataStoreSettings: boolean): void {

    // Init the "settings type" radio-group if it is not existed
    if (!this.nodeSettingsTypeControl) {
      this.initNodeSettingsTypeRadioGroup(useDefaultNodeDataStoreSettings);
    }

    this.nodeSettingsTypeControl.patchValue(
      useDefaultNodeDataStoreSettings ? NodeSettingsTypes.DEFAULT : NodeSettingsTypes.CUSTOM,
      { onlySelf: true, emitEvent: false }
    );

    this.nodeSettingsTypeControl.markAsPristine();
  }

  private updateDataStoreSettingsFormValue(): void {

    // Convert the "settings" data to the form control data format
    this.dataStoreSettings = this.getConvertedSettingsValues(this.settings?.dataStoreSettings, false);

    // Init the "settings" form if it is not existed
    if (!this.nodeDataStoreSettingsForm) {
      this.nodeDataStoreSettingsForm = this.getNodeDataStoreSettingsFormInitValue(this.settings?.dataStoreSettings);
    }

    Object.keys(this.nodeDataStoreSettingsForm.value).map((dataStoreSettingsFormControlName: DataStoreType) => {
      const currentDataStoreTypeSettings =
        this.dataStoreSettings.find(dataStoreTypeSettings => dataStoreTypeSettings.dataStoreType === dataStoreSettingsFormControlName);

      if (currentDataStoreTypeSettings) {
        this.nodeDataStoreSettingsForm.get(dataStoreSettingsFormControlName)
          .patchValue({
            [NodeDataStoreSettingsKeys.BYTES_USED_WARNING_THRESHOLD_KEY]:
              currentDataStoreTypeSettings[NodeDataStoreSettingsKeys.ENABLE_BYTES_USED_WARNING_KEY] ?
                currentDataStoreTypeSettings[NodeDataStoreSettingsKeys.BYTES_USED_WARNING_THRESHOLD_KEY] :
                null,
            [NodeDataStoreSettingsKeys.PURGE_AUTOMATICALLY_KEY]:
              currentDataStoreTypeSettings[NodeDataStoreSettingsKeys.PURGE_AUTOMATICALLY_KEY] || false,
            [NodeDataStoreSettingsKeys.PURGE_AGE_KEY]:
              currentDataStoreTypeSettings[NodeDataStoreSettingsKeys.PURGE_AGE_KEY] || 0,
            [NodeDataStoreSettingsKeys.ARCHIVE_DIRECTORY_KEY]:
              currentDataStoreTypeSettings[NodeDataStoreSettingsKeys.ARCHIVE_ON_PURGE_KEY] ?
                currentDataStoreTypeSettings[NodeDataStoreSettingsKeys.ARCHIVE_DIRECTORY_KEY] :
                null
          }, { onlySelf: true, emitEvent: false });
      }
    });

    setTimeout(() => { // use timeout because of the handling of the multiple inner form fields that take a time
      this.nodeDataStoreSettingsForm.markAsPristine();
    });
  }

  private getConvertedBytesUsedWarningThresholdValue(bytesUsedWarningThreshold: number, toServerDataFormat: boolean): number {
    const from = toServerDataFormat ? SizeUnitsEnum.MB : SizeUnitsEnum.Bytes;
    const to = toServerDataFormat ? SizeUnitsEnum.Bytes : SizeUnitsEnum.MB;
    const result = this.dataUnitsScaleService.convertBytes(bytesUsedWarningThreshold, from, to);
    return toServerDataFormat ? result : +result.toFixed(2);
  }

  private getConvertedSettingsValues(
    dataStoreSettings: Array<DataManagementNodeConfigRecord>,
    toServerDataFormat: boolean
  ): Array<DataManagementNodeConfigRecord> {
    if (dataStoreSettings === void 0) {
      return;
    }
    const settingsConvertedValue = dataStoreSettings.map(storeTypeSettings => ({ ...storeTypeSettings })); // deep clone
    return settingsConvertedValue.map((settingsGroup: DataManagementNodeConfigRecord) => {

      settingsGroup.purgeAge = this.dataManagement.getConvertedPurgeAgeValue(settingsGroup.purgeAge, toServerDataFormat);
      settingsGroup.bytesUsedWarningThreshold = this.getConvertedBytesUsedWarningThresholdValue(
        settingsGroup.bytesUsedWarningThreshold,
        toServerDataFormat,
      );

      return settingsGroup;
    }).sort((a, b) => {
      return NODES_SORT_ORDER.indexOf(a.dataStoreType) - NODES_SORT_ORDER.indexOf(b.dataStoreType);
    });
  }

  public applyBtnClick(): void {
    const dataStoreSettings: DataManagementNodeConfigRecord[] = [];
    Object.entries(this.nodeDataStoreSettingsForm?.value)
      .forEach(([dataStoreType, dataStoreTypeSettingsCurrentValue]: [DataStoreType, DataManagementNodeConfigRecord]) => {
        if (dataStoreTypeSettingsCurrentValue) {
          dataStoreTypeSettingsCurrentValue.enableBytesUsedWarning =
            !this.commonService.isNil(dataStoreTypeSettingsCurrentValue.bytesUsedWarningThreshold);
          dataStoreTypeSettingsCurrentValue.archiveOnPurge =
            !this.commonService.isNil(dataStoreTypeSettingsCurrentValue.archiveDirectory);
        } else {

          // use init value if current store data has not been changed
          dataStoreTypeSettingsCurrentValue = this.getConvertedSettingsValues(this.settings.dataStoreSettings, false)
            ?.find(initValue => initValue.dataStoreType === dataStoreType);
        }

        dataStoreSettings.push({...dataStoreTypeSettingsCurrentValue, dataStoreType: dataStoreType});
      });

    const settings = {
      node: { ...this.settings?.node, useDefaultSettings: this.nodeSettingsTypeControl?.value === NodeSettingsTypes.DEFAULT },
      dataStoreSettings: this.getConvertedSettingsValues(dataStoreSettings, true)
    };

    this.applySettings.emit(settings);
  }

  public revertBtnClick(): void {
    this.updateFormElementsData();
  }

  get isSettingsDataChanged(): boolean {

    // Return true if the settings type radio exists and changed or the form data is changed
    return !((this.isCustomNodeSelected ? this.nodeSettingsTypeControl.pristine : true)
      && this.nodeDataStoreSettingsForm.pristine);
  }

  get isApplyBtnEnabled(): boolean {

    // Check the form validation state only if the specific node with the custom settings is selected
    // Otherwise, return true
    const isFormValid =
      this.isCustomNodeSelected ?
        this.nodeSettingsTypeControl.value === NodeSettingsTypes.DEFAULT ? true : this.nodeDataStoreSettingsForm.valid
        : this.nodeDataStoreSettingsForm.valid;

    // Return true if the settings type or form data is changed and valid
    return this.isSettingsDataChanged && isFormValid;
  }

  purgeClick(dataStoreType: DataStoreType) {
    this.taskRequest.emit({taskType: TaskTypes.PURGE, dataStoreType: dataStoreType, nodeId: this.settings.node.id});
  }

  backupClick(dataStoreType: DataStoreType) {
    this.taskRequest.emit({taskType: TaskTypes.BACKUP, dataStoreType: dataStoreType, nodeId: this.settings.node.id});
  }

  resetClick(dataStoreType: DataStoreType) {
    this.taskRequest.emit({taskType: TaskTypes.RESET, dataStoreType: dataStoreType, nodeId: this.settings.node.id});
  }

}
