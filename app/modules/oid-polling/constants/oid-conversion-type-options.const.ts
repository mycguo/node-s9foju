import { SelectOption } from '../../shared/components/form/select/models/select-option';
import { ConversionType } from '../../../services/custom-oids/enums/conversion-type.enum';

export const OID_CONVERSION_TYPE_OPTIONS: SelectOption<ConversionType>[] = [
  {
    name: 'Multiply',
    id: ConversionType.MULTIPLY
  },
  {
    name: 'Divide',
    id: ConversionType.DIVIDE
  }
];
