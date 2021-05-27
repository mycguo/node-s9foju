import {Application} from './application';

export interface ApplicationGroupResponse {
  id: string;
  name: string;
  applications: Array<Application>;
}
