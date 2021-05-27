import ValueMetadata from './value-metadata.enums';

export default class KeyValueMetadata {

  constructor(
    public readonly key: string,
    public readonly value: any,
    public readonly valueType?: ValueMetadata
  ) { }
}
