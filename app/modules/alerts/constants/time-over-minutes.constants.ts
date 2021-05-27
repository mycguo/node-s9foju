import {SimpleInputModel} from '../../shared/components/form/simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../../shared/components/form/simple-input/models/html-input-types.enum';

export const TIME_OVER_MINUTES_KEY = 'timeOverMinutes';

export const TimeOverMinutesInputModel = new SimpleInputModel(
  HtmlInputTypesEnum.number,
  'For at Least',
  '0',
  '>',
  'min'
);
