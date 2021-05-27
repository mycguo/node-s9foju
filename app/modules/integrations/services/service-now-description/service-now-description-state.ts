import {ServiceNowFieldResponse} from '../service-now-fields/models/service-now-field-response';
import AkitaStoreWrapper from '../../../../store/akita-store-wrapper';

export type ServiceNowDescriptionState = ServiceNowFieldResponse & AkitaStoreWrapper;
