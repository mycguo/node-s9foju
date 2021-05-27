import {Injectable} from '@angular/core';
import {ByteFormattingPipe} from '../../modules/shared/pipes/byte-formatting/byte-formatting.pipe';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {CommonService} from '../../utils/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class FormValidationMessageService {
  private _errorMessages = {
    required: (error) => `This field is required`,
    minlength: (error: { requiredLength: number, actualLength: number }) => `Must be at least ${error.requiredLength} characters`,
    maxlength: (error: { requiredLength: number, actualLength: number }) => `Cannot be over ${error.requiredLength} characters`,
    min: (error: { min: number, actual: number }) => `Must be greater than ${error.min - 1}`,
    max: (error: { max: number, actual: number }) => `Must be less than ${error.max}`,

    hostname: ({valid: boolean}) => `Invalid Hostname/IP`,
    number: ({valid: boolean}) => `Should be a number`,
    requiredFileType: ({requiredFileType: boolean}) => `File type not supported`,
    invalidName: (invalidName: { value: string }) => `${invalidName.value} is not allowed`,
    moreThan: (moreThan: { min: number, postfix: string }) => `Should be more than ${moreThan.min}${moreThan.postfix || ''}`,
    image: (image: {
      size: { expected: number, received: number },
      ratio: { expected: { width: number, height: number }, received: { width: number, height: number } }
    }) => {
      if (image.size !== void 0) {
        return `File size is bigger than ${this.sizeUnitsPipe.transform(image.size.expected)}`;
      } else {
        return `File does not meet aspect ratio of ${image.ratio.expected.width}:${image.ratio.expected.height}`;
      }
    },
    uniqueField: (error) => 'This field should be unique',
    invalidPort: (port: string) => `Invalid port number ${port}`,
    invalidPortRange: (portRange: string) => `Invalid port range ${portRange}`,
    invalidIp: (address) => `Invalid IP address ${address}`,
    invalidIpRange: (range) => `Invalid IP range ${range}`,
    wholeNumber: () => 'Only whole numbers allowed'
  };

  constructor(private sizeUnitsPipe: ByteFormattingPipe,
              private commonService: CommonService) {
  }

  /**
   * Build error message
   * @param validationErrors - Form validation errors
   * @param overrides - custom error message mapping functions
   */
  getErrorMessage(validationErrors: ValidationErrors, overrides?: { [key: string]: (args: any) => string }): string {
    if (!this.commonService.isNil(validationErrors)) {
      const firstKey = Object.keys(validationErrors)[0];
      return this.getMessage(firstKey, validationErrors[firstKey], overrides);
    }

    return void 0;
  }

  /**
   * Get message from form error key
   * @param key - error key
   * @param args - error information
   * @param overrides - custom error message map
   */
  private getMessage(key: string, args: any, overrides?: { [key: string]: (args: any) => string }): string {
    if (overrides !== void 0 && overrides[key] !== void 0) {
      return overrides[key](args);
    } else if (this._errorMessages[key] !== void 0) {
      return this._errorMessages[key](args);
    } else {
      if (typeof args === 'string') {
        return args;
      } else {
        return 'Invalid Input';
      }
    }
  }
}
