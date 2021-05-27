import { Pipe, PipeTransform } from '@angular/core';

const SPECIAL_CHARS_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '\'': '&apos;',
  '"': '&quot;'
};

@Pipe({
  name: 'escapeSpecialChars'
})
export class EscapeSpecialCharsPipe implements PipeTransform {

  transform(value: string): string {
    if (value && typeof value === 'string') {
      return value.replace(/[&<'"]/g, (tag) => SPECIAL_CHARS_MAP[tag]);
    }
    return value;
  }

}
