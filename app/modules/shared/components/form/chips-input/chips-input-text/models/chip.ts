import {Comparable} from 'src/app/modules/shared/interfaces/comparable';
import {Colorable} from 'src/app/modules/shared/interfaces/colorable';
import {ToString} from 'src/app/modules/shared/interfaces/to-string';
import {Color} from 'src/app/models/color';
import {ComponentBgColorClassEnum} from 'src/app/constants/component-bg-color-class.enum';
import {GetValue} from 'src/app/modules/shared/interfaces/get-value';

export default class Chip implements Comparable<Chip>, ToString, Colorable, GetValue {

    private name: string; // display name & value of the Chip
    color: Color;

    constructor({name, colorValue}: {name: string, colorValue?: ComponentBgColorClassEnum}) {
        this.name = name;
        this.color =  new Color(colorValue || ComponentBgColorClassEnum.NORMAL);
    }

    compare(a: Chip): number {
        return a.toString().toLowerCase().localeCompare(this.name.toLowerCase());
    }

    equals(a: Chip): boolean {
        return a.getValue() === this.getValue();
    }

    toString(): string {
        return this.name;
    }

    getValue(): string {
        return this.name;
    }

    markAsInvalid(): void {
        this.color.value = this.color.isSelected() ?
            ComponentBgColorClassEnum.CRITICAL_SELECTED :
            ComponentBgColorClassEnum.CRITICAL;
    }

    markAsValid(): void {
        this.color.value = this.color.isSelected() ?
            ComponentBgColorClassEnum.NORMAL_SELECTED :
            ComponentBgColorClassEnum.NORMAL;
    }

}
