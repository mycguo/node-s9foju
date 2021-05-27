import SdwanHttpHeaderTypeEnum from './sdwan-http-header-type.enum';

export interface SdwanHttpHeaderControl {
    name: string;
    value: string;
    base64: SdwanHttpHeaderTypeEnum;
}
