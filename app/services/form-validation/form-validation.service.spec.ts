import { TestBed } from '@angular/core/testing';

import { FormValidationService } from './form-validation.service';
import {FormControl, ValidatorFn} from '@angular/forms';

function getRandomNumber(min, max): string {
  return (Math.floor(Math.random() * (max - min + 1)) + min) + '' ;
}

describe('FormValidationService', () => {

  let service: FormValidationService;

  beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.get(FormValidationService);
    }
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('portRange', () => {
    let portRangeValidator: ValidatorFn;
    beforeEach(() => {
      portRangeValidator = service.portRange();
      }
    );

    it('should return null if input string empty', () => {
      const control = new FormControl('input');
      control.setValue(null);
      expect(portRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid port number', () => {
      const control = new FormControl('input');
      control.setValue(getRandomNumber(0, 65535));
      expect(portRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid port number (number)', () => {
      const control = new FormControl('input');
      control.setValue(123);
      expect(portRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid port range', () => {
      const control = new FormControl('input');
      control.setValue(`${getRandomNumber(0, 32767)}-${getRandomNumber(32768, 65535)}`);
      expect(portRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid multiline port range', () => {
      const control = new FormControl('input');
      control.setValue(
        '123-456' + '\n' +
        '456-789' + '\n' +
        '890-1234');
      expect(portRangeValidator(control)).toBeNull();
    });

    it('should return error if input is invalid port number (out of range)', () => {
      const control = new FormControl('input');
      const value = getRandomNumber(65536, 4294836225);
      control.setValue(value);
      expect(portRangeValidator(control)).toEqual({ invalidPort: value });
    });

    it('should return error if input is invalid port number (not a number)', () => {
      const control = new FormControl('input');
      control.setValue('asdf');
      expect(portRangeValidator(control)).toEqual({ invalidPort: 'asdf' });
    });

    it('should return error if input is invalid port range (extra dash)', () => {
      const control = new FormControl('input');
      control.setValue('443-');
      expect(portRangeValidator(control)).toEqual({ invalidPortRange: '443-' });
    });

    it('should return error if input is invalid port range (1-65536)', () => {
      const control = new FormControl('input');
      control.setValue('1-65536');
      expect(portRangeValidator(control)).toEqual({ invalidPortRange: '1-65536' });
    });

    it('should return error if input is invalid multiline port range (1234-123)', () => {
      const control = new FormControl('input');
      control.setValue(
        '123-456' + '\n' +
        '1234-123' + '\n' + // invalid
        '890-1234'
      );
      expect(portRangeValidator(control)).toEqual({ invalidPortRange: '1234-123' });
    });
  });

  describe('ipAddress', () => {
    let ipAddressValidator: ValidatorFn;
    beforeEach(() => {
        ipAddressValidator = service.ipAddress();
      }
    );

    it('should return null if input string empty', () => {
      const control = new FormControl('input');
      control.setValue(null);
      expect(ipAddressValidator(control)).toBeNull();
    });

    it('should return null if input is valid ip address', () => {
      const control = new FormControl('input');
      control.setValue(`${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}`);
      expect(ipAddressValidator(control)).toBeNull();
    });

    it('should return error if input is invalid ip address (out of range)', () => {
      const control = new FormControl('input');
      const value = `${getRandomNumber(256, 8092)}.1.1.1`;
      control.setValue(value);
      expect(ipAddressValidator(control)).toEqual({ invalidIp: value });
    });

    it('should return error if input is invalid ip address (partial)', () => {
      const control = new FormControl('input');
      control.setValue('256.1.1');
      expect(ipAddressValidator(control)).toEqual({ invalidIp: '256.1.1' });
    });

  });

  describe('ipRange', () => {
    let ipRangeValidator: ValidatorFn;
    beforeEach(() => {
        ipRangeValidator = service.ipRange();
      }
    );

    it('should return null if input string empty', () => {
      const control = new FormControl('input');
      control.setValue(null);
      expect(ipRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid ip address', () => {
      const control = new FormControl('input');
      control.setValue(`${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}.${getRandomNumber(1, 255)}`);
      expect(ipRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid ip range', () => {
      const control = new FormControl('input');
      control.setValue('123.123.123.123-234.234.234.234');
      expect(ipRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid ip range (CIDR)', () => {
      const control = new FormControl('input');
      control.setValue('123.123.123.123/24');
      expect(ipRangeValidator(control)).toBeNull();
    });

    it('should return null if input is valid multiline ip range', () => {
      const control = new FormControl('input');
      control.setValue(
        '123.123.123.123-234.234.234.234' + '\n' +
        '123.123.123.123/16' + '\n' +
        '123.123.123.123'
      );
      expect(ipRangeValidator(control)).toBeNull();
    });

    it('should return error if input is invalid ip address (out of range)', () => {
      const control = new FormControl('input');
      control.setValue('256.1.1.1');
      expect(ipRangeValidator(control)).toEqual({ invalidIpRange: '256.1.1.1' });
    });

    it('should return error if input is invalid ip range (out of range)', () => {
      const control = new FormControl('input');
      control.setValue('255.1.1.1-256.1.1.1');
      expect(ipRangeValidator(control)).toEqual({ invalidIpRange: '255.1.1.1-256.1.1.1' });
    });

    it('should return error if input is invalid ip range (CIDR)', () => {
      const control = new FormControl('input');
      control.setValue('255.1.1.1/123');
      expect(ipRangeValidator(control)).toEqual({ invalidIpRange: '255.1.1.1/123' });
    });

    it('should return error if input is invalid ip range (not completed range)', () => {
      const control = new FormControl('input');
      control.setValue('255.1.1.1-');
      expect(ipRangeValidator(control)).toEqual({ invalidIpRange: '255.1.1.1-' });
    });

    it('should return error if input is invalid ip range (start > end)', () => {
      const control = new FormControl('input');
      control.setValue('255.1.1.255-255.1.1.1');
      expect(ipRangeValidator(control)).toEqual({ invalidIpRange: '255.1.1.255-255.1.1.1' });
    });

    it('should return error if input is invalid multiline ip range (start > end)', () => {
      const control = new FormControl('input');
      control.setValue(
        '123.123.123.123-234.234.234.234' + '\n' +
        '255.255.1.255-255.255.1.1' + '\n' +
        '123.123.123.123'
      );
      expect(ipRangeValidator(control)).toEqual({ invalidIpRange: '255.255.1.255-255.255.1.1' });
    });

  });
});
