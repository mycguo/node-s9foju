import Alert from './alert.model';
import AlertIdentity from './alertIdentity';

export default class AlertsSummary {
  critical = 0;
  warning = 0;
  info = 0;

  alertsList: Array<AlertIdentity> = [];

  getAlertMap(): {[status: string]: number} {
    return {
      critical: this.critical,
      warning: this.warning,
      info: this.info
    };
  }
}
