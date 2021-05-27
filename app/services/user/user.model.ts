import UserRole from './serverModel/userRole.model';
import UserServerModel from './serverModel/user.server-model';
import {UserAccess} from './userAccess';

export default class User extends UserServerModel {
  access: UserAccess;
}
