import { CustomOid } from './models/custom-oid';
import { ProcessingType } from './enums/processing-type.enum';
import { ConversionType } from './enums/conversion-type.enum';
import { AssociationType } from './enums/association-type.enum';

export class CustomOidsServiceFixtures {
  static readonly CUSTOM_OIDS: Array<CustomOid> = [
    {
      id: '33956e56-1a10-4cd2-a247-7b75548463c5',
      name: 'CPU 1 Minute',
      oidValue: '.1.3.6.1.4.1.9.9.109.1.1.1.1.7.7',
      units: '%',
      processingType: ProcessingType.DELTA,
      conversionType: ConversionType.MULTIPLY,
      conversionFactor: 1,
      associationType: AssociationType.SPECIFIC_DEVICES,
      association: {deviceSerials: ['9K4GX6G29L5', '9B68IV2ARHE']}
    }
  ];
}
