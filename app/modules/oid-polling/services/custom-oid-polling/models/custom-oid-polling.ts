import { CustomOid } from '../../../../../services/custom-oids/models/custom-oid';
import { ConversionType } from '../../../../../services/custom-oids/enums/conversion-type.enum';
import { AssociationType } from '../../../../../services/custom-oids/enums/association-type.enum';
import { ProcessingType } from '../../../../../services/custom-oids/enums/processing-type.enum';

export default class CustomOidPolling implements CustomOid {
  association: { deviceSerials: Array<string> };
  associationType: AssociationType;
  conversionFactor: number;
  conversionType: ConversionType;
  id: string;
  name: string;
  oidValue: string;
  processingType: ProcessingType;
  units: string;

  deviceNames: Array<string>;
  deviceNamesString: string;
  processingTypeString: string;

  constructor(
    {
      customOid,
      deviceNames
    }: {
      customOid: CustomOid,
      deviceNames: Array<string>
    }
  ) {

    this.association = customOid.association;
    this.associationType = customOid.associationType;
    this.conversionFactor = customOid.conversionFactor;
    this.conversionType = customOid.conversionType;
    this.id = customOid.id;
    this.name = customOid.name;
    this.oidValue = customOid.oidValue;
    this.processingType = customOid.processingType;
    this.units = customOid.units;
    this.deviceNames = deviceNames;
    this.deviceNamesString = this.deviceNamesToString;
    this.processingTypeString = customOid.processingType.toLowerCase();
  }

  get deviceNamesToString(): string {
    return this.associationType === AssociationType.ALL_DEVICES ? 'All Devices' : this.deviceNames?.join(', ');
  }
}
