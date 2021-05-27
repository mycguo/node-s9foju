import Users from './user.model';

export default class UsersServiceFixtures {
  static readonly ERROR_RESPONSE = {status: 500, statusText: 'Server Error'};

  static readonly USERS_RESPONSE: {meta: Object, users: Users} = {
     meta: {
       href: 'https://10.1.40.164:8093/v1/userManagement/users',
       queryParameters: {
         includeAccessibleDevicesList: [
           'false'
        ]
      },
       http: {
         method: 'GET',
         statusCode: 200,
         statusReason: 'OK'
      }
    },
     users: [
      {
         userName: 'user33',
         directory: 'INTERNAL',
         role: 'FULL_CONFIG',
         activated: true,
         sessionTimeoutInterval: '900000',
         deviceAccess: {
           configureDevices: [],
           viewDevices: [],
           storeCredentialsDevices: [],
           allViewAccess: true,
           allConfigureAccess: false,
           defaultSettings: {
             view: true,
             configure: false,
             storeCredentials: false
          }
        },
         displayName: 'User33'
      },
      {
         userName: 'fullconfig',
         directory: 'INTERNAL',
         role: 'FULL_CONFIG',
         activated: true,
         sessionTimeoutInterval: '900000',
         deviceAccess: {
           configureDevices: [],
           viewDevices: [],
           storeCredentialsDevices: [],
           allViewAccess: true,
           allConfigureAccess: false,
           defaultSettings: {
             view: true,
             configure: false,
             storeCredentials: false
          }
        },
         displayName: 'fullconfig'
      },
      {
         userName: 'admin',
         directory: 'INTERNAL',
         role: 'ADMIN',
         activated: true,
         sessionTimeoutInterval: '86400000',
         deviceAccess: {
           configureDevices: [],
           viewDevices: [],
           storeCredentialsDevices: [],
           allViewAccess: true,
           allConfigureAccess: true,
           defaultSettings: {
             view: true,
             configure: false,
             storeCredentials: false
          }
        },
         displayName: 'admin'
      },
      {
         userName: 'monitor',
         directory: 'INTERNAL',
         role: 'MONITOR_ONLY',
         activated: true,
         sessionTimeoutInterval: '900000',
         deviceAccess: {
           configureDevices: [],
           viewDevices: [],
           storeCredentialsDevices: [],
           allViewAccess: true,
           allConfigureAccess: false,
           defaultSettings: {
             view: true,
             configure: false,
             storeCredentials: false
          }
        },
         displayName: 'monitor'
      },
      {
         userName: 'fullconf',
         directory: 'INTERNAL',
         role: 'FULL_CONFIG',
         activated: true,
         sessionTimeoutInterval: '900000',
         deviceAccess: {
           configureDevices: [],
           viewDevices: [],
           storeCredentialsDevices: [],
           allViewAccess: true,
           allConfigureAccess: false,
           defaultSettings: {
             view: true,
             configure: false,
             storeCredentials: false
          }
        },
         displayName: 'fullconf'
      }
    ]
  };

}
