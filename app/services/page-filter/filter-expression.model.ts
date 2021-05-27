import LaFilterSupportEnums from '../../../../../project_typings/enums/laFilterSupportEnums';

export interface FilterExpression {
  key: LaFilterSupportEnums;
  values: Array<string>;
}
