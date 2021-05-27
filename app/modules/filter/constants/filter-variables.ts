import { FilterOperators } from './filter-operators';

const operatorsList = Object.values(FilterOperators).join('|');

export const FilterVariables = {
  DEFAULT_FILTER_LIMIT: 50,
  DEFAULT_VALIDATION_MESSAGE: 'Invalid value',
  FILTER_COMPLEXITY_LIMIT: 1000000,
  FILTER_COMPLEXITY_LIMIT_MESSAGE: 'Too many unique combinations for provided search filter. Please reduce number of applied filters and try again',
  ACTION_ICON_BUTTON_WIDTH: 27,
  FILTER_SEPARATOR: '___', // 3x_, not great, not terrible
  CHARACTER_AND: '&',
  CHARACTER_OR: '|',
  CHARACTER_OPEN_PAREN: '(',
  CHARACTER_CLOSE_PAREN: ')',
  CHARACTER_EQUALS: '=',
  SEARCH_STRING_SPLIT_REGEXP: /(?!")[&|]{1,2}(?!")+/g,
  SEARCH_STRING_REMOVE_SPACES_REGEXP: /\s+(?=([^"]*"[^"]*")*[^"]*$)/g, // remove spaces, except for those in quotes
  FILTER_SPLIT_REGEXP: new RegExp(`"?([a-z0-9.]+)"?(?:\\s?(${operatorsList})\\s?"?(.+)\\b)?`, 'i'),
  FILTER_OPERATOR_REGEXP: /(?!")(!?=){1}/,
  COMPOUND_REGEXP: /[(]device=[^&]+[&]{1,2}interface=[^&)]+[)]/g,
  COMPOUND_FILTER_ARROW: ' → ',
  SWITCH_TO_DROPDOWN_LENGTH: 5,
};
