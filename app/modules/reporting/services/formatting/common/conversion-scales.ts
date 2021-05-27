import {ConversionScale} from './conversion-scale';
import {ConversionScaleType} from './conversion-scale-type';

export class ConversionScales {
  seconds: ConversionScale;
  bitRate: ConversionScale;
  bytes: ConversionScale;
  byte: ConversionScale;
  packets: ConversionScale;

  constructor() {
    this.seconds = new ConversionScale(ConversionScaleType.SECONDS);
    this.bitRate = new ConversionScale(ConversionScaleType.BIT_RATE);
    this.bytes = new ConversionScale(ConversionScaleType.BYTES);
    this.byte = new ConversionScale(ConversionScaleType.BYTE);
    this.packets = new ConversionScale(ConversionScaleType.PACKETS);
  }
}
