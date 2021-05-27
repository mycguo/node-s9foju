import {RequestErrorsNoDataPipe} from './request-errors-no-data.pipe';
import {CommonService} from '../../../../utils/common/common.service';
import {LaNoDataMessage} from '../../../../../../../client/nxuxComponents/components/laNoDataMessage/laNoDataMessage.model.data';

describe('RequestErrorsNoDataPipe', () => {
  const pipe = new RequestErrorsNoDataPipe(new CommonService);
  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a no data object', () => {
    const errMsg = 'test error';
    const transformedValue = pipe.transform(new Error(errMsg));
    expect(transformedValue).toEqual(jasmine.objectContaining(new LaNoDataMessage(RequestErrorsNoDataPipe.DEFAULT_TITLE, errMsg)));
  });

  it('should return a no data object with custom title', () => {
    const errMsg = 'test error';
    const titleOverride = 'title';
    const transformedValue = pipe.transform(new Error(errMsg), {title: titleOverride});
    expect(transformedValue).toEqual(jasmine.objectContaining(new LaNoDataMessage(titleOverride, errMsg)));
  });
});
