import CustomApplication from '../../models/custom-application';
import CustomApplicationModel from '../../models/custom-application-model';

export class CustomApplicationsServiceFixtures {
  static readonly APPLICATIONS: CustomApplication[] = [
    {
      id: 'asdfas',
      rank: 1,
      name: 'Africa',
      description: 'Description',
      ipRanges: ['10.1.1.1'],
      portMap: {
        protocols: ['ICMP'],
        portRanges: ['3434', '2424']
      },
      nbarIds: [1]
    },
    {
      id: 'qwerqret',
      rank: 2,
      name: 'Asia',
      description: 'Description asia',
      ipRanges: ['10.1.1.2'],
      portMap: {
        protocols: ['TCP'],
        portRanges: ['3434', '2424']
      },
      nbarIds: [1, 2]
    },
    {
      id: 'zxcvzxvc',
      rank: 3,
      name: 'Europe',
      description: 'Description Europe',
      ipRanges: ['10.1.1.2'],
      portMap: {
        protocols: ['UDP'],
        portRanges: ['3434', '2424']
      },
      nbarIds: [],
      dscpTypes: [0, 1, 8]
    }
  ];

  static readonly CUSTOM_APPLICATIONS: CustomApplicationModel[] = [
    new CustomApplicationModel({
      id: 'asdfas',
      rank: 1,
      name: 'Africa',
      description: 'Description',
      ipRanges: ['10.1.1.1'],
      portMap: {
        protocols: ['ICMP'],
        portRanges: ['3434', '2424']
      },
      nbarIds: [1],
      nbarApps: [
        {id: '1', name: 'app1'}
      ]
    }),
    new CustomApplicationModel({
      id: 'qwerqret',
      rank: 2,
      name: 'Asia',
      description: 'Description asia',
      ipRanges: ['10.1.1.2'],
      portMap: {
        protocols: ['TCP'],
        portRanges: ['3434', '2424']
      },
      nbarIds: [1, 2],
      nbarApps: [
        {id: '1', name: 'app1'},
        {id: '2', name: 'app2'}
      ]
    }),
    new CustomApplicationModel({
      id: 'zxcvzxvc',
      rank: 3,
      name: 'Europe',
      description: 'Description Europe',
      ipRanges: ['10.1.1.2'],
      portMap: {
        protocols: ['UDP'],
        portRanges: ['3434', '2424']
      },
      nbarIds: [],
      nbarApps: [],
      dscpTypes: [0, 1, 8],
      dscpTypesString: 'default, 1, CS1'
    })
  ];

  static readonly NBAR_APPLICATIONS = [
    {id: '1', name: 'app1'},
    {id: '2', name: 'app2'}
  ];

  static readonly DSCP_TYPES = [
    {
      'value' : 0,
      'name' : 'default'
    }, {
      'value' : 1,
      'name' : '1'
    }, {
      'value' : 2,
      'name' : '2'
    }, {
      'value' : 3,
      'name' : '3'
    }, {
      'value' : 4,
      'name' : '4'
    }, {
      'value' : 5,
      'name' : '5'
    }, {
      'value' : 6,
      'name' : '6'
    }, {
      'value' : 7,
      'name' : '7'
    }, {
      'value' : 8,
      'name' : 'CS1'
    }, {
      'value' : 9,
      'name' : '9'
    }, {
      'value' : 10,
      'name' : 'AF11'
    }, {
      'value' : 11,
      'name' : '11'
    }, {
      'value' : 12,
      'name' : 'AF12'
    }, {
      'value' : 13,
      'name' : '13'
    }, {
      'value' : 14,
      'name' : 'AF13'
    }, {
      'value' : 15,
      'name' : '15'
    }, {
      'value' : 16,
      'name' : 'CS2'
    }
  ];
}
