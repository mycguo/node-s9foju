import { Injectable } from '@angular/core';
import SizeUnitsEnum from '../../modules/shared/enums/size-units.enum';

@Injectable({
  providedIn: 'root'
})
export class UnitConversionUtilities {
  convertBytes(value: number, from: SizeUnitsEnum, to: SizeUnitsEnum, decimals = 2): number {
    if (value === 0) { return 0; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const indexFrom = Object.keys(SizeUnitsEnum).indexOf(from);
    const indexTo = Object.keys(SizeUnitsEnum).indexOf(to);

    if (indexFrom > indexTo) {
      return Number((value * Math.pow(k, Number(indexFrom) - Number(indexTo))).toFixed(dm));
    } else {
      return Number((value / Math.pow(k, Number(indexTo) - Number(indexFrom))).toFixed(dm));
    }
  }
}
