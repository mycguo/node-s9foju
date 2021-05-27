import {Application} from './application';

export interface ApplicationGroupRequest {
  name: string;
  applications: Array<Application>;
}
