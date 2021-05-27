import {HttpErrorResponse} from '@angular/common/http';

export interface ApiError extends HttpErrorResponse {
  clientMessage: string;
}
