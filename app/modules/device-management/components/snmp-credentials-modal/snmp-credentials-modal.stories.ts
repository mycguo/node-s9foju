import { action } from '@storybook/addon-actions';
import { ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { SnmpCredentialsModalComponent } from './snmp-credentials-modal.component';
import DeviceSnmpCredentials from '../../services/device-management-data/interfaces/device-snmp-credentials';
import { SharedModule } from '../../../shared/shared.module';

export default {
  title: 'Device-management/SnmpCredentialsModalComponent',

  decorators: [
    moduleMetadata({
      imports: [SharedModule, ReactiveFormsModule],
      declarations: [SnmpCredentialsModalComponent],
    }),
  ],
};

export const Default = () => ({
  component: SnmpCredentialsModalComponent,
  props: {
    submitClicked: (val) => action('Form')(val),
    modalSubtitle: 'NETSCALER',
    profiles: [
      { id: '1', profileName: 'Name 1' },
      { id: '2', profileName: 'Name 2' },
      { id: '3', profileName: 'Name 3' },
    ],
    deviceCredentials: <DeviceSnmpCredentials>{
      type: 'manual',

      snmpVersion: 'v3',
      port: 161,
      settings: {
        snmpAuthPassPhrase: 'Ys2Q5Xxu7g3gUoHxfUFifqiXSXjd2tkc',
        snmpAuthProtocol: 'SHA',
        snmpPrivPassPhrase: 'x3Fmpv9OpIsnk0Qg3rH25BKBd66fxzSK',
        snmpPrivProtocol: 'AES',
        snmpSecurityName: '',
      },
    },
  },
});

Default.story = {
  name: 'default',
};

export const Profile = () => ({
  component: SnmpCredentialsModalComponent,
  props: {
    isMultipleDevices: true,
    submitClicked: (val) => action('Form')(val),
    modalSubtitle: 'NETSCALER',
    profiles: [
      { id: '1', profileName: 'Name 1' },
      { id: '2', profileName: 'Name 2' },
      { id: '3', profileName: 'Name 3' },
    ],
    deviceCredentials: <DeviceSnmpCredentials>{
      type: 'profile',
      id: '2',
      // snmpVersion: 'v3',
      // port: 161,
      // settings: {
      //   snmpAuthPassPhrase: 'Ys2Q5Xxu7g3gUoHxfUFifqiXSXjd2tkc',
      //   snmpAuthProtocol: 'SHA',
      //   snmpPrivPassPhrase: 'x3Fmpv9OpIsnk0Qg3rH25BKBd66fxzSK',
      //   snmpPrivProtocol: 'AES',
      //   snmpSecurityName: 'admin'
      // },
    },
  },
});

Profile.story = {
  name: 'profile',
};
