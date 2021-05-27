import {HttpErrorResponse} from '@angular/common/http';
import DetailedError from '../../modules/shared/components/loading/detailed-error';

export class ClientErrorHandler {
  static buildDetailedError(err: HttpErrorResponse, title: string = void 0, defaultMsg: string = 'An Error Occurred'): DetailedError {
    let errMsg = defaultMsg;
    if (err.error?.userMessage != null) {
      errMsg = err.error.userMessage;
    } else if (err.error?.message != null) {
      errMsg = err.error.message;
    } else if (err.message != null) {
      errMsg = err.message;
    }

    return new DetailedError(title, errMsg);
  }
}
