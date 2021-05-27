import { moduleMetadata } from '@storybook/angular';
import { DiskStorageCapacityComponent } from './disk-storage-capacity.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ByteFormattingPipe } from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import HtmlInputTypesEnum from '../../../shared/components/form/simple-input/models/html-input-types.enum';
import SizeUnitsEnum from '../../../shared/enums/size-units.enum';
import { DiskStorageCapacityLegendItem } from './models/disk-storage-capacity-legend-item/disk-storage-capacity-legend-item';
import { UnitConversionUtilities } from '../../../../services/unit-conversion-utilities/unit-conversion-utilities.service';
import { SimpleInputModel } from '../../../shared/components/form/simple-input/models/simple-input.model';

export default {
  title: 'Settings/DiskStorageCapacityComponent',

  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [DiskStorageCapacityComponent],
      providers: [ByteFormattingPipe, UnitConversionUtilities],
    }),
  ],
};

export const Default = () => {
  const totalDiskSpace = 800;
  const usedDiskSpace = 250;
  const maxStoreSize = 300;
  return {
    props: {
      totalDiskSpace: totalDiskSpace,
      usedDiskSpace: usedDiskSpace,
      maxStoreSize: maxStoreSize,
      legend: [
        new DiskStorageCapacityLegendItem('report', 150, true, maxStoreSize),
      ],
    },
    template: `
            <nx-disk-storage-capacity
              [totalDiskSpace]="totalDiskSpace"
              [usedDiskSpace]="usedDiskSpace"
              [legend]="legend">
            </nx-disk-storage-capacity>
            `,
  };
};

export const WithInput = () => {
  const totalDiskSpace = 800000000000;
  const usedDiskSpace = 25000000000;
  const maxStoreSize = 300000000000;
  const maxStoreSizeUnits = SizeUnitsEnum.GB;
  const inputModel = new SimpleInputModel(
    HtmlInputTypesEnum.number,
    '',
    void 0,
    void 0,
    maxStoreSizeUnits
  );

  const formGroup = new FormGroup({
    storage: new FormControl(
      new UnitConversionUtilities().convertBytes(
        maxStoreSize,
        SizeUnitsEnum.Bytes,
        maxStoreSizeUnits
      ),
      [
        Validators.max(
          new UnitConversionUtilities().convertBytes(
            totalDiskSpace,
            SizeUnitsEnum.Bytes,
            SizeUnitsEnum.GB
          )
        ),
      ]
    ),
  });

  return {
    props: {
      totalDiskSpace: totalDiskSpace,
      usedDiskSpace: usedDiskSpace,
      maxStoreSize: maxStoreSize,
      legend: [
        new DiskStorageCapacityLegendItem(
          'report',
          24999000000,
          true,
          maxStoreSize
        ),
      ],
      inputModel: inputModel,
      control: formGroup.get('storage'),
    },
    template: `
            <nx-disk-storage-capacity
              [totalDiskSpace]="totalDiskSpace"
              [usedDiskSpace]="usedDiskSpace"
              [legend]="legend"
              [maxStoreSizeLegendDetailsTmpl]="maxStoreSizeLegendDetailsTmpl">
              <ng-template #maxStoreSizeLegendDetailsTmpl>
                <nx-simple-input
                  class="nx-disk-storage-capacity-legend__item-bottom-simple-input"
                  [formControl]="control"
                  [inputModel]="inputModel">
                </nx-simple-input>
              </ng-template>
            </nx-disk-storage-capacity>
            `,
  };
};

export const MultipleStores = () => {
  const totalDiskSpace = 800;
  const usedDiskSpace = 450;
  const maxStoreSize = 300;
  return {
    props: {
      totalDiskSpace: totalDiskSpace,
      usedDiskSpace: usedDiskSpace,
      maxStoreSize: maxStoreSize,
      legend: [
        new DiskStorageCapacityLegendItem('first', 100),
        new DiskStorageCapacityLegendItem('second', 50),
        new DiskStorageCapacityLegendItem('report', 150, true, maxStoreSize),
      ],
    },
    template: `
              <nx-disk-storage-capacity
                [totalDiskSpace]="totalDiskSpace"
                [usedDiskSpace]="usedDiskSpace"
                [legend]="legend">
              </nx-disk-storage-capacity>
              `,
  };
};
