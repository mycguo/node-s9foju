import { HighlightPipe } from './highlight.pipe';
import {inject, TestBed} from '@angular/core/testing';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {SecurityContext} from '@angular/core';
import { EscapeSpecialCharsPipe } from '../escape-special-chars/escape-special-chars.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        EscapeSpecialCharsPipe
      ]
    });
    pipe = new HighlightPipe(TestBed.inject(DomSanitizer), TestBed.inject(EscapeSpecialCharsPipe));
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should trim and transform', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample', ' ampl ');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('S<u style="font-weight: 700">ampl</u>e');
  }));

  it('should trim and transform ignoring case', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample', ' sam');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('<u style="font-weight: 700">Sam</u>ple');
  }));

  it('should transform with special character', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@sample.com', '@SAM ');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sample<u style="font-weight: 700">@sam</u>ple.com');
  }));

  it('should transform with several special characters', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample!.)@sample.com', 'E!.)@');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sampl<u style="font-weight: 700">e!.)@</u>sample.com');
  }));

  it('should transform dot', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@sample.com', ' .');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sample@sample<u style="font-weight: 700">.</u>com');
  }));

  it('should transform with several matches', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@sample.com', 'mpl');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sa<u style="font-weight: 700">mpl</u>e@sa<u style="font-weight: 700">mpl</u>e.com');
  }));

  it('should transform with several matches & capital', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('SamPle@sample.com', 'mpl');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sa<u style="font-weight: 700">mPl</u>e@sa<u style="font-weight: 700">mpl</u>e.com');
  }));

  it('should transform with whitespace', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample @sample.com', 'e @s ');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sampl<u style="font-weight: 700">e @s</u>ample.com');
  }));

  it('should transform each searching symbol', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@eee.com', 'e');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sampl<u style="font-weight: 700">e</u>@<u style="font-weight: 700">e</u><u style="font-weight: 700">e</u><u style="font-weight: 700">e</u>.com');
  }));

  it('should transform with zero', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample0@sample.com', '0');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sample<u style="font-weight: 700">0</u>@sample.com');
  }));

  it('should not transform with empty string', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@sample.com', '');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sample@sample.com');
  }));

  it('should not transform with null', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@sample.com', null);
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sample@sample.com');
  }));

  it('should not transform with mismatched value', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const transformedValue = pipe.transform('Sample@sample.com', 'samx');
    const strValue = sanitizer.sanitize(SecurityContext.HTML, transformedValue);
    expect(strValue).toBe('Sample@sample.com');
  }));

});
