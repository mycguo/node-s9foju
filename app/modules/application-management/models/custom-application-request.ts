export class CustomApplicationRequest {
  name: string;
  description: string;
  ipRanges?: Array<string>;
  portMap?: {
    protocols: Array<string>,
    portRanges: Array<string>
  };
  nbarIds?: Array<number>;
  dscpTypes?: Array<number>;
  urls?: Array<string>;

  constructor(
    {
      name,
      description,
      ipRanges,
      portMap,
      nbarIds,
      dscpTypes,
      urls
    }:
      {
        name: string,
        description: string,
        ipRanges?: Array<string>,
        portMap?: {
          protocols: Array<string>,
          portRanges: Array<string>
        },
        nbarIds?: Array<number>,
        dscpTypes?: Array<number>,
        urls?: Array<string>
      }
  ) {
    this.name = name;
    this.description = description;
    this.ipRanges = ipRanges;
    this.portMap = portMap;
    this.nbarIds = nbarIds;
    this.dscpTypes = dscpTypes;
    this.urls = urls;
  }
}
