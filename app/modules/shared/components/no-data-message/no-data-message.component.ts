import { Component, Input, TemplateRef } from '@angular/core';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';

@Component({
  selector: 'nx-no-data-message',
  templateUrl: './no-data-message.component.html',
  styleUrls: ['./no-data-message.component.less']
})
export class NoDataMessageComponent {

  @Input() titleTmpl: TemplateRef<any>;
  @Input() model: LaNoDataMessage;

  constructor() {
  }

}
