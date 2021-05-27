import { AssociationType } from '../../../../../services/custom-oids/enums/association-type.enum';

export interface PreConfiguredOidPollingSettings {
  pollingType: string;
  associationType: AssociationType;
  association: { deviceSerials: Array<string> };
}
