import {EmailCourier} from './email-courier';
import {ServiceNowCourier} from './service-now-courier';
import {SnmpTrapCourier} from './snmp-trap-courier';
import {SyslogCourier} from './syslog-courier';
import {WebUiCourier} from './web-ui-courier';

export interface AlertSharing {
  useDefaultSharingConfig: boolean;
  email: EmailCourier;
  serviceNow: ServiceNowCourier;
  snmpTrap: SnmpTrapCourier;
  syslog: SyslogCourier;
  webUi: WebUiCourier;
}
