import InfoElementType from '../../../../enums/info-element-type';
import SummaryField from './summary-field';

interface ReportResponseSummaryField extends SummaryField {
  defaultLabel: string;
  enterpriseNumber?: string;
  fieldId: string;
  href: string;
  id: string;
  infoElementType: InfoElementType;
  label: string;
  name: string;
  semanticType?: string;
  units?: string;
}

export default ReportResponseSummaryField;
