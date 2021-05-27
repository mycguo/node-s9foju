import {Injectable} from '@angular/core';
import ConversionRate from '../../../../../../../../client/nxComponents/services/laUnitFormatter/ConversionRate';
import {ConversionScale} from './conversion-scale';
import {ConversionScales} from './conversion-scales';
import ScaleEntry from './scale-entry';

@Injectable({
  providedIn: 'root'
})
export class UnitFormatterService {
  private readonly conversionMap;

  constructor() {
    const allScales = new ConversionScales();
    this.conversionMap = this.createConversionMap(allScales);
  }

  /**
   * Combine all of our scales into a single mapping
   */
  private createConversionMap(allScales: ConversionScales) {
    const combinedScales = {};
    const scaleNames = Object.keys(allScales);
    scaleNames.forEach((scaleName) => {
      const scale: ConversionScale = allScales[scaleName];
      scale.entries.forEach((entry) => {
        combinedScales[entry.unit] = {powerOfTen: entry.powerOfTen, scale: scale};
      });
    });
    return combinedScales;
  }

  /**
   * Creates a conversion object based on inspecting the current multiple of the maximum value.
   * The conversion object will provide easy formatting from any value that has the same
   * unit as the given peak value and format it into it's correct formatting.
   *
   * @param peakValue the maximum value which can occur
   * @param originalUnit the unit that represents the peakValue we are trying to accomodate
   * @param conversionScale the conversion scale to use
   * @param originalPowerOfTen the power of ten that represents the current unit
   * @returns ConversionRate which can be used to translate any value of similar units to the correct format
   */
  private conversion(peakValue: number, originalUnit: string, originalPowerOfTen: number,
                     conversionScale: ConversionScale): ConversionRate {
    let peakValuePowerOfTen = Math.floor(peakValue).toString().length - 1; // Minus one for first digit
    peakValuePowerOfTen += originalPowerOfTen; // Shift the base 10 power by the difference of the peakValue vs the unitValue

    // Set the multiple based on the number zeroes that exist on the metric scale where unit prefixes are on thousands
    const mod = this.modAnyNumber(peakValuePowerOfTen, 3);
    let factor = peakValuePowerOfTen - mod;

    // Grab the units if this scale has them
    const scaleEntry = conversionScale.getEntryByPowerOfTen(factor);
    let units = scaleEntry !== void 0 ? scaleEntry.unit : void 0;

    // If the conversion scale doesn't have the units, then grab the closest value
    if (units === undefined) {
      // Get the keys for the conversion scale and sort them
      const sortedScaleEntries = conversionScale.entries.sort((a: ScaleEntry, b: ScaleEntry) => {
        if (a.powerOfTen > b.powerOfTen) {
          return 1;
        } else if (a.powerOfTen < b.powerOfTen) {
          return -1;
        } else {
          return 0;
        }
      });

      const highestValue = sortedScaleEntries[sortedScaleEntries.length - 1];

      // If there is nothing in the scale that is large enough, take the largest possible unit
      if (factor > highestValue.powerOfTen) {
        factor = highestValue.powerOfTen;
        units = highestValue.unit;
      }
    }

    // Calculate the difference to convert from the original unit to the peak value
    if (originalPowerOfTen !== void 0) {
      factor -= originalPowerOfTen;
    }
    return new ConversionRate(units, Math.pow(10, -factor));
  }

  /**
   * Show numbers based on local standards.
   * Example: input number is 10000.2
   * US Output: 10,000.2
   * EU Output: 10.000,2
   * Slavic countries: 10 000.2
   * @param number - the number to display correctly
   * @returns string - a correctly formatted string
   */
  public numberLocaleDisplay(number: number): string {
    if (typeof number === 'number') {
      return number.toLocaleString();
    }

    return number;
  }

  /**
   * Based on the unit and max value, determine the conversion rate.
   * Note: This logic only can convert from a smaller to a larger number
   * @param unit the unit that is represented by the peakValue
   * @param peakValue the maximum value we want to account for
   * @return A conversion rate object which can be used to scale other values by calling it's getScaledValue() method
   */
  public determineConversionRate(unit: string, peakValue: number): ConversionRate {
    const conversionObject = this.conversionMap[unit];
    return conversionObject ? this.conversion(peakValue, unit, conversionObject.powerOfTen, conversionObject.scale)
      : new ConversionRate(unit, 1);
  }

  /**
   * Determine if the unit can be converted
   */
  public supportsConversion(unit: string): boolean {
    return this.conversionMap[unit] !== undefined;
  }

  /**
   * A custom mod function is required because javascript incorrectly performs mod on negative numbers.
   * @param numerator - The numerator or 1st number (n) in "n % d"
   * @param denominator - The denominator or 2nd number (d) in "n % d"
   */
  private modAnyNumber(numerator: number, denominator: number) {
    return ((numerator % denominator) + denominator) % denominator;
  }
}
