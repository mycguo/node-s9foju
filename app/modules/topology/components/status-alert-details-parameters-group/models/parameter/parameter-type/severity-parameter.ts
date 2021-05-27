import {TemplateType} from '../../../enums/template-type.enum';
import SeverityTypes from '../../../../../../../../../../project_typings/api/alerting/alerts/SeverityTypes';
import Parameter from '../parameter';

export default class SeverityParameter implements Parameter<SeverityTypes> {
  public templateType: TemplateType;

  constructor(public key: string,
              public value: SeverityTypes) {
    this.templateType = TemplateType.SEVERITY;
  }
}
