import { PreConfiguredOid } from './pre-configured-oid';
import { PreConfiguredOidPollingSettings } from './pre-configured-oid-polling-settings';
import { PreConfiguredOidMetaData } from './pre-configured-oid-meta-data';
import { AssociationType } from '../../../../../services/custom-oids/enums/association-type.enum';

export class PreConfiguredOidPollingModel implements PreConfiguredOid {
  id: string;
  metaData: { oids: Array<PreConfiguredOidMetaData> };
  settings: PreConfiguredOidPollingSettings;
  deviceNames: Array<string>;

  // helper props
  pollingTypeName: string;
  oidNamesString: string;
  deviceNamesString: string;

  constructor({
    preConfiguredOid,
    deviceNames,
  }: {
      preConfiguredOid: PreConfiguredOid
      deviceNames: Array<string>,
  }) {
    this.id = preConfiguredOid.id;
    this.metaData = preConfiguredOid.metaData;
    this.settings = preConfiguredOid.settings;
    this.pollingTypeName = preConfiguredOid.settings?.pollingType;
    this.deviceNames = deviceNames;
    this.oidNamesString = this.oidNamesToString;
    this.deviceNamesString = this.deviceNamesToString;
  }

  get oidNamesToString(): string {
    return this.metaData?.oids?.map(({ name }) => name).join(', ');
  }

  get deviceNamesToString(): string {
    return this.settings.associationType === AssociationType.ALL_DEVICES ? 'All Devices' : this.deviceNames?.join(', ');
  }
}
