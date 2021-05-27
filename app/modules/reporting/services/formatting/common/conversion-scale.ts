/**
 * All unit conversion scales should be here.
 * Each conversion scale should start with a key of 0 and a base unit.
 * The base unit must be the smallest unit for that scale.
 * Each sequential key should be the number of 0's (power of ten) to translate the base unit to the given value.
 */
import ScaleEntry from './scale-entry';
import {ConversionScaleType} from './conversion-scale-type';

export class ConversionScale {
  private static readonly secondsEntries: Array<ScaleEntry> = [
    {unit: 'ns', powerOfTen: -9},
    {unit: 'us', powerOfTen: -6},
    {unit: 'ms', powerOfTen: -3},
    {unit: 's', powerOfTen: 0}
  ];
  private static readonly bitRateEntries: Array<ScaleEntry> = [
    {unit: 'bps', powerOfTen: 0},
    {unit: 'Kbps', powerOfTen: 3},
    {unit: 'Mbps', powerOfTen: 6},
    {unit: 'Gbps', powerOfTen: 9},
    {unit: 'Tbps', powerOfTen: 12}
  ];
  private static readonly bytesEntries: Array<ScaleEntry> = [
    {unit: 'bytes', powerOfTen: 0},
    {unit: 'KB', powerOfTen: 3},
    {unit: 'MB', powerOfTen: 6},
    {unit: 'GB', powerOfTen: 9},
    {unit: 'TB', powerOfTen: 12}
  ];
  private static readonly byteEntries: Array<ScaleEntry> = [
    {unit: 'byte', powerOfTen: 0},
    {unit: 'KB', powerOfTen: 3},
    {unit: 'MB', powerOfTen: 6},
    {unit: 'GB', powerOfTen: 9},
    {unit: 'TB', powerOfTen: 12}
  ];
  private static readonly packetsEntries: Array<ScaleEntry> = [
    {unit: 'pps', powerOfTen: 0},
    {unit: 'Kpps', powerOfTen: 3},
    {unit: 'Mpps', powerOfTen: 6},
    {unit: 'Gpps', powerOfTen: 9},
    {unit: 'Tpps', powerOfTen: 12}
  ];

  entries: Array<ScaleEntry>;
  type: ConversionScaleType;

  constructor(type: ConversionScaleType) {
    this.type = type;
    switch (type) {
      case ConversionScaleType.SECONDS:
        this.entries = ConversionScale.secondsEntries;
        break;
      case ConversionScaleType.BIT_RATE:
        this.entries = ConversionScale.bitRateEntries;
        break;
      case ConversionScaleType.BYTES:
        this.entries = ConversionScale.bytesEntries;
        break;
      case ConversionScaleType.BYTE:
        this.entries = ConversionScale.byteEntries;
        break;
      case ConversionScaleType.PACKETS:
        this.entries = ConversionScale.packetsEntries;
        break;
    }
  }

  public getEntryByUnit(unit: string) {
    return this.entries.find(entry => entry.unit === unit);
  }

  public getEntryByPowerOfTen(powerOfTen: number): ScaleEntry {
    return this.entries.find(entry => entry.powerOfTen === powerOfTen);
  }
}
