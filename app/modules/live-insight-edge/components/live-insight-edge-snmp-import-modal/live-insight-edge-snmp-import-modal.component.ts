import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { FormField } from '../../../shared/components/form/form-field/form-field';
import { SelectOption } from '../../../shared/components/form/select/models/select-option';

@Component({
  selector: 'nx-live-insight-edge-snmp-import-modal',
  templateUrl: './live-insight-edge-snmp-import-modal.component.html',
  styleUrls: ['./live-insight-edge-snmp-import-modal.component.less']
})
export class LiveInsightEdgeSnmpImportModalComponent
  extends DialogComponent<void, { timeRange: number }>
  implements OnInit, OnDestroy {

  displayModel: FormField;
  options: Array<SelectOption>;
  formControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent<void, { timeRange: number }>>
  ) {
    super(void 0, dialogRef);

    this.formControl = new FormControl(90);
  }

  ngOnInit(): void {
    this.initModal();
  }

  ngOnDestroy(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ timeRange: this.formControl.value });
  }

  private initModal() {
    this.options = [
      new SelectOption(30, '30 days'),
      new SelectOption(60, '60 days'),
      new SelectOption(90, '90 days'),
      new SelectOption(180, '180 days'),
      new SelectOption(365, '365 days')
    ];

    this.displayModel = {
      label: 'Import data for selected time range:'
    };
  }
}
