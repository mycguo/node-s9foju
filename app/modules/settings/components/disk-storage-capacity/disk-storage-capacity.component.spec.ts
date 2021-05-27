import {DiskStorageCapacityComponent} from './disk-storage-capacity.component';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {ByteFormattingPipe} from '../../../shared/pipes/byte-formatting/byte-formatting.pipe';
import {UnitConversionUtilities} from '../../../../services/unit-conversion-utilities/unit-conversion-utilities.service';

describe('DiskStorageCapacityComponent', () => {
  let component: DiskStorageCapacityComponent;
  let fixture: ComponentFixture<DiskStorageCapacityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        DiskStorageCapacityComponent
      ],
      providers: [
        ByteFormattingPipe,
        UnitConversionUtilities
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskStorageCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
