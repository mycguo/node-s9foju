import {CustomApplicationRequest} from './custom-application-request';

export default interface CustomApplication extends CustomApplicationRequest {
  id: string;
  rank: number;
}
