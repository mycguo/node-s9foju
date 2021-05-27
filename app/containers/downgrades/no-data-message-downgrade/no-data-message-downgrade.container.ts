import {ChangeDetectorRef, Component, Input} from '@angular/core';
import { LaNoDataMessage } from '../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';
import SetElementState from '../SetElementState.interface';
import {BaseContainer} from '../../base-container/base.container';

interface NoDataMessageState {
  model: LaNoDataMessage;
}

@Component({
  selector: 'nx-no-data-message-downgrade-container',
  template: `
      <nx-no-data-message
              [model]="state.model"
      ></nx-no-data-message>
  `,
  styles: []
})
export class NoDataMessageDowngradeContainer extends BaseContainer<NoDataMessageState> implements SetElementState<NoDataMessageState> {

  state: NoDataMessageState = {model: new LaNoDataMessage('')};

  @Input() setElementState = (state) => this.stateInput(state);

  constructor(public cd: ChangeDetectorRef) {
    super(cd);
  }

  stateInput(state: NoDataMessageState) {
   this.setState({model: {...state.model}});
  }

}
