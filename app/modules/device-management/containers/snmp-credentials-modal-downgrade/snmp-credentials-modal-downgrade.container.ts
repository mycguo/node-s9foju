import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseContainer } from '../../../../containers/base-container/base.container';
import SetElementState from '../../../../containers/downgrades/SetElementState.interface';

interface SnmpCredentialsState {
  devices: {systemName: string, serial: string}[];
}

@Component({
  selector: 'nx-snmp-credentials-modal-downgrade-container',
  template: `
    <nx-snmp-credentials-modal-container
      [devices]="state.devices"
      (cancelClicked)="cancelClicked.emit()"
      (submitClicked)="submitClicked.emit()"
    ></nx-snmp-credentials-modal-container>
  `,
  styles: []
})
export class SnmpCredentialsModalDowngradeContainer
  extends BaseContainer<SnmpCredentialsState>
  implements SetElementState<SnmpCredentialsState> {

  @Output() cancelClicked = new EventEmitter();
  @Output() submitClicked = new EventEmitter();
  @Input() setElementState = (state: SnmpCredentialsState) => this.stateInput(state);

  constructor(
    public cd: ChangeDetectorRef
  ) {
    super(cd);
    this.state = { devices: []};
  }

  stateInput(state: SnmpCredentialsState): void {
    this.setState(state);
  }
}
