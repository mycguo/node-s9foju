import {RequestErrorsDetailedErrorPipe} from './request-errors-detailed-error.pipe';
import DetailedError from '../../components/loading/detailed-error';
import {RequestErrors} from '../../../../utils/api/request-errors';
import RequestType from '../../../../utils/api/request-type.enum';

describe('RequestErrorsDetailedErrorPipe', () => {
  const pipe = new RequestErrorsDetailedErrorPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a detailed error object', () => {
    const errMsg = 'test error';
    const error: RequestErrors = {
      requestType: RequestType.GET,
      errorMessage: errMsg
    };
    const transformedValue = pipe.transform(error);
    expect(transformedValue).toEqual(jasmine.objectContaining(new DetailedError(RequestErrorsDetailedErrorPipe.DEFAULT_TITLE, errMsg)));
  });
});
