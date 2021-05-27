import InfoElementType from '../../../../enums/info-element-type';

export default interface SummaryField {
  id: string;
  label: string;
  name: string;
  infoElementType: InfoElementType;
}
