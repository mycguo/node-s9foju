import {ApplicationGroupResponse} from '../../models/application-group-response';

export class ApplicationGroupsServiceFixtures {
  static readonly GROUPS: ApplicationGroupResponse[] = [
    {
      'id': 'a2b4d33e-0e83-4452-a4d8-9dec58e7e06a',
      'name': 'authentication-services',
      'applications': [
        {
          'name': 'active-directory'
        },
        {
          'name': 'authentication-services'
        },
        {
          'name': 'backup-systems'
        },
        {
          'name': 'cdc'
        },
        {
          'name': 'cisco-nac'
        },
        {
          'name': 'codaauth2'
        }
      ]
    },
    {
      'id': 'fa19c6be-6f14-4326-b172-f03d62c77c45',
      'name': 'consumer-video-streaming',
      'applications': [
        {
          'name': 'airplay'
        },
        {
          'name': 'amazon-instant-video'
        },
        {
          'name': 'appleqtc'
        },
        {
          'name': 'appleqtcsrvr'
        },
        {
          'name': 'babelgum'
        }
      ]
    },
    {
      'id': 'da10bd53-40bb-425c-a699-b74bfe1b7d78',
      'name': 'enterprise-video-broadcast-custom',
      'applications': [
        {
          'name': 'cisco-ip-camera'
        }
      ]
    }
  ];
}
