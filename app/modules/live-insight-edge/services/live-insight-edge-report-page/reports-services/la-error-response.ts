import {HttpErrorResponse} from '@angular/common/http';

export default interface LaErrorResponse extends HttpErrorResponse {
  error: {
    statusCode: number;
    message: string;
    userMessage: string;
  };
}
