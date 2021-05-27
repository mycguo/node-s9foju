import {Component, Input} from '@angular/core';
import {Group} from './models/group/group';
import {TemplateType} from './enums/template-type.enum';

@Component({
  selector: 'nx-status-alert-details-parameters-group',
  templateUrl: './status-alert-details-parameters-group.component.html',
  styleUrls: ['./status-alert-details-parameters-group.component.less']
})
export class StatusAlertDetailsParametersGroupComponent {
  @Input() group: Group;
  public templateType = TemplateType;
}
