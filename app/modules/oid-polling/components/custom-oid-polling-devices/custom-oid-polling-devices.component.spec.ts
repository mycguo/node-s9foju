import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomOidPollingDevicesComponent } from './custom-oid-polling-devices.component';
import { MockComponent } from 'ng-mocks';
import { GridComponent } from '../../../grid/components/grid/grid.component';
import { TableStringFilterComponent } from '../../../grid/components/filters/table-string-filter/table-string-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

describe('CustomOidPollingDevicesComponent', () => {
  let component: CustomOidPollingDevicesComponent;
  let fixture: ComponentFixture<CustomOidPollingDevicesComponent>;

  beforeEach( waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ReactiveFormsModule
      ],
      declarations: [
        CustomOidPollingDevicesComponent,
        MockComponent(GridComponent),
        MockComponent(TableStringFilterComponent),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOidPollingDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should initialize the columns for the table', () => {
      expect(component.columns).not.toBe(null);
      expect(component.columns.length).toBeGreaterThan(0);
    });
  });
});
