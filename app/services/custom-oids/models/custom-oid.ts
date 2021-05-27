import { ProcessingType } from '../enums/processing-type.enum';
import { ConversionType } from '../enums/conversion-type.enum';
import { AssociationType } from '../enums/association-type.enum';

export interface CustomOid {
  id: string;
  name: string;
  oidValue: string;
  processingType: ProcessingType;
  units: string;
  conversionType: ConversionType;
  conversionFactor: number;
  associationType: AssociationType;
  association: { deviceSerials: Array<string> };
}
