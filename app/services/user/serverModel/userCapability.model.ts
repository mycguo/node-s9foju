import CapabilityPermission from '../capabilityPermission.type';


export default class UserCapability {
  resourceTypeId: string;
  permissions: Array<CapabilityPermission>;
}
