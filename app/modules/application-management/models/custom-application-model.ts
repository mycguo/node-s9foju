import CustomApplication from './custom-application';
import { NbarApplication } from './nbar-application';

export default class CustomApplicationModel implements CustomApplication {
  id: string;
  rank: number;
  name: string;
  description: string;
  ipRanges: Array<string>;
  portMap: {
    protocols: Array<string>,
    portRanges: Array<string>
  };
  nbarIds: Array<number>;
  dscpTypes: Array<number>;
  urls: Array<string>;

  // helper props
  portRangesString: string;
  ipRangesString: string;
  rankString: string;
  nbarApps: Array<NbarApplication>;
  nbarAppsString: string;
  protocols: Array<string>;
  dscpTypesString: string;
  urlsString: string;
  protocolsText: string;

  constructor(
    {
      id,
      rank,
      name,
      description,
      ipRanges,
      portMap,
      nbarIds,
      nbarApps,
      dscpTypes,
      dscpTypesString,
      urls
    }: {
      id: string,
      rank: number,
      name: string,
      description: string,
      ipRanges?: Array<string>,
      portMap?: {
        protocols: Array<string>,
        portRanges: Array<string>
      },
      nbarIds?: Array<number>,
      nbarApps?: Array<NbarApplication>,
      dscpTypes?: Array<number>,
      dscpTypesString?: string,
      urls?: Array<string>
    }
  ) {
    this.id = id;
    this.rank = rank;
    this.name = name;
    this.description = description;
    this.ipRanges = ipRanges;
    this.portMap = portMap;
    this.nbarIds = nbarIds;
    this.urls = urls;
    this.portRangesString = this.portRangesToString;
    this.ipRangesString = this.ipRangesToString;
    this.urlsString = this.urlsToString;
    this.rankString = (this.rank + 1).toString(10);
    this.nbarApps = nbarApps;
    this.nbarAppsString = this.nbarAppsToString;
    this.dscpTypes = dscpTypes;
    this.dscpTypesString = dscpTypesString;
    this.protocols = portMap?.protocols;
    this.protocolsText = this.protocolsToString;
  }

  get portRangesToString(): string {
    return this.portMap?.portRanges?.join(', ');
  }

  get ipRangesToString(): string {
    return this.ipRanges?.join(', ');
  }

  get nbarAppsToString(): string {
    return this.nbarApps?.map(app => app.name).join(', ');
  }

  get urlsToString(): string {
    return this.urls?.join(', ');
  }

  get protocolsToString(): string {
    return this.protocols?.join(', ');
  }

}
