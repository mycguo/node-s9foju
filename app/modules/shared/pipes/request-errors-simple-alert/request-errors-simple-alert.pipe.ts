import {Pipe, PipeTransform} from '@angular/core';
import {RequestErrors} from '../../../../utils/api/request-errors';
import SimpleAlert from '../../components/simple-alert/model/simple-alert';
import {SIMPLE_ALERT_TYPE_ENUM} from '../../components/simple-alert/model/simple-alert-type.enum';

@Pipe({
  name: 'requestErrorsSimpleAlert'
})
export class RequestErrorsSimpleAlertPipe implements PipeTransform {

  transform(value: RequestErrors, args?: { title?: string, closeTimeout?: number }): SimpleAlert {
    if (value == null) {
      return void 0;
    }
    return new SimpleAlert(
      args && args.title ? args.title : 'Error',
      value.errorMessage,
      SIMPLE_ALERT_TYPE_ENUM.ERROR,
      args != null && args.closeTimeout != null ? args.closeTimeout : null
    );
  }

}
