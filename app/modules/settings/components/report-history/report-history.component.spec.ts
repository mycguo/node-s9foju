import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AfterContentInit, Component, ViewChild} from '@angular/core';
import {MockComponent} from 'ng-mocks';

import {ByteFormattingPipe} from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import {SimpleInputComponent} from '../../../shared/components/form/simple-input/simple-input.component';
import {DiskStorageCapacityComponent} from '../disk-storage-capacity/disk-storage-capacity.component';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {CardComponent} from '../../../shared/components/card/card.component';
import {ReportHistoryComponent} from './report-history.component';
import {ReportHistory} from '../../services/report-history/models/report-history.interface';
import {ReportHistoryValidation} from '../../services/report-history/models/report-history-validation.interface';
import {ReportStorage} from '../../services/report-storage/models/report-storage';
import SizeUnitsEnum from '../../../shared/enums/size-units.enum';
import {UnitConversionUtilities} from '../../../../services/unit-conversion-utilities/unit-conversion-utilities.service';

@Component({
  selector: 'report-history-host',
  template: `
    <nx-report-history
      [reportHistory]="reportHistory"
      [reportHistoryValidation]="reportHistoryValidation"
      [storage]="storage">
    </nx-report-history>
  `
})
class ReportHistoryHostComponent implements AfterContentInit {
  @ViewChild(ReportHistoryComponent) reportHistoryComponentRef: ReportHistoryComponent;

  storage: ReportStorage = {
    diskSizeTotal: 509774139392,
    diskSizeUsed: 81902059520,
    resultStoreSize: 1926580547,
    reportCacheStorageLimit: 427585469153
  };

  reportHistory: ReportHistory = {
    adhocDays: 7,
    scheduledDays: 365,
    sharedDays: 30
  };

  reportHistoryValidation: ReportHistoryValidation = {
    adhoc: {min: 1, max: 30},
    scheduled: {min: 1, max: 730},
    shared: {min: 1, max: 730}
  };

  ngAfterContentInit() {}
}

describe('ReportHistoryComponent', () => {
  let wrapperComponent: ReportHistoryHostComponent;
  let fixture: ComponentFixture<ReportHistoryHostComponent>;
  let component: ReportHistoryComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        ReportHistoryHostComponent,
        ByteFormattingPipe,
        DiskStorageCapacityComponent,
        ReportHistoryComponent,
        MockComponent(CardComponent),
        MockComponent(SimpleInputComponent),
        MockComponent(ButtonComponent)
      ],
      providers: [
        ByteFormattingPipe,
        UnitConversionUtilities
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHistoryHostComponent);
    wrapperComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    component = wrapperComponent.reportHistoryComponentRef;

  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Form Validation', () => {
    it('should display "Max Report Store Size" validation messages', () => {
      component.formGroup.get('storage')
        .reset(new UnitConversionUtilities().convertBytes(
          wrapperComponent.storage.diskSizeTotal, SizeUnitsEnum.Bytes, SizeUnitsEnum.GB) + 0.01
        );
      fixture.detectChanges();
      expect(component.formGroup.get('storage').invalid)
        .toBeTruthy('"Max Report Store Size" is valid but the value is bigger than "Available Free Space"');

      component.formGroup.get('storage').reset(0);
      fixture.detectChanges();
      expect(component.formGroup.get('storage').invalid)
        .toBeTruthy('"Max Report Store Size" is valid but the value is not bigger than 0');
    });
  });
});
