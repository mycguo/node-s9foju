import {Component, Input, Self, TemplateRef} from '@angular/core';
import {NgControl} from '@angular/forms';
import {ChipsInputTextComponent} from '../chips-input-text/chips-input-text.component';
import ChipMultiselect from './models/chip-multiselect';
import ChipsInputMultiselectModel from './models/chips-input-multiselect.model';
import { fadeAnimation } from '../../../../../../animations/fade.animation';
import {ChipSet} from '../../../chip-set/models/chip-set';
import {CommonService} from 'src/app/utils/common/common.service';

@Component({
  selector: 'nx-chips-input-multiselect',
  templateUrl: './chips-input-multiselect.component.html',
  styleUrls: ['../chips-input-text/chips-input-text.component.less', './chips-input-multiselect.component.less'],
  animations: fadeAnimation,
  providers: [ {provide: CommonService} ]
})
export class ChipsInputMultiselectComponent extends ChipsInputTextComponent {

  @Input() chipsInputModel: ChipsInputMultiselectModel; // override chipsInputModel from super class
  @Input() suggestionsItemTmpl: TemplateRef<any>;

  chipSet: ChipSet<ChipMultiselect>;

  constructor(@Self() public controlDir: NgControl, protected commonService: CommonService) {
    super(controlDir, commonService);
  }

  addValueMultiselect(value: string): void {
    if (this.chipsInputModel.allowCustomText) {
      this.addValueHandler(value);
    }
  }

  addOption(option: ChipMultiselect): void {
    this.valueChanges([...(this.control.value || []), option.getValue()]);
  }

  protected updateChipSet(values: string[]): void {
    const newChipSet = new ChipSet<ChipMultiselect>();
    values?.forEach((value: string) => {
      const option = this.chipsInputModel?.options?.find((o: ChipMultiselect) => o.getValue() === value);
      newChipSet.add(option || new ChipMultiselect({name: value}));
    });
    this.chipSet = newChipSet;
  }

}
