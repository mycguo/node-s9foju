import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseContainer} from '../../../../../containers/base-container/base.container';
import SetElementState from '../../../../../containers/downgrades/SetElementState.interface';
import PeekDrilldownRequest from '../../../../../../../../project_typings/client/nxComponents/laFlowPathAnalysis/PeekDrilldownRequest';

interface FlowPathCrosslaunchState {
  drilldown: PeekDrilldownRequest;
  deviceId: string;
  error: Error;
}

@Component({
  selector: 'nx-flow-path-crosslaunch-modal-downgrade-container',
  template: `
    <nx-flow-path-crosslaunch-modal-container
        [drilldown]="state.drilldown"
        [deviceId]="state.deviceId"
        (cancelClicked)="cancelClicked.emit()"
    ></nx-flow-path-crosslaunch-modal-container>
  `,
  styles: [
  ]
})
export class FlowPathCrosslaunchModalDowngradeContainer
  extends BaseContainer<FlowPathCrosslaunchState>
  implements SetElementState<FlowPathCrosslaunchState> {

  @Output() cancelClicked = new EventEmitter();
  @Input() setElementState = (state: FlowPathCrosslaunchState) => this.stateInput(state);

  constructor(
    public cd: ChangeDetectorRef
  ) {
    super(cd);
    this.state = { drilldown: void 0, deviceId: void 0, error: void 0 };
  }

  stateInput(state: FlowPathCrosslaunchState): void {
    this.setState(state);
  }

}
