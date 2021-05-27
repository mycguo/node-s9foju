import { ComponentBgColorClassEnum } from 'src/app/constants/component-bg-color-class.enum';
import Chip from '../../chips-input-text/models/chip';

export default class ChipMultiselect extends Chip {

    private id: string; // value of the ChipMultiselect
    customTemplateValue: string;

    constructor({id, name, colorValue, customTemplateValue}: {
        id?: string,
        name: string,
        colorValue?: ComponentBgColorClassEnum,
        customTemplateValue?: string
    }) {
        super({
            name,
            colorValue : colorValue ||
                customTemplateValue ? ComponentBgColorClassEnum.WARNING : ComponentBgColorClassEnum.NORMAL
        });
        this.id = id || name;
        this.customTemplateValue = customTemplateValue || null;
    }

    getValue(): string {
        return this.id;
    }

    markAsValid(): void {
        if (this.customTemplateValue) {
            this.color.value = this.color.isSelected() ?
                ComponentBgColorClassEnum.WARNING_SELECTED :
                ComponentBgColorClassEnum.WARNING;
        } else {
            this.color.value = this.color.isSelected() ?
                ComponentBgColorClassEnum.NORMAL_SELECTED :
                ComponentBgColorClassEnum.NORMAL;
        }

    }
}

