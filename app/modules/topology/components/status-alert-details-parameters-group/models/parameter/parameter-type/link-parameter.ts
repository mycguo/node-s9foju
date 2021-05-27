import {TemplateType} from '../../../enums/template-type.enum';
import Parameter from '../parameter';
import LinkParameterValue from './link-parameter-value';

export default class LinkParameter implements Parameter<LinkParameterValue> {
  public templateType: TemplateType;

  constructor(public key: string,
              public value: LinkParameterValue) {
    this.templateType = TemplateType.LINK;
  }
}
