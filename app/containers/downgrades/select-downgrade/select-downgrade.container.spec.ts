import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDowngradeContainer } from './select-downgrade.container';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../modules/shared/shared.module';

describe('SelectDowngradeContainer', () => {
  let component: SelectDowngradeContainer;
  let fixture: ComponentFixture<SelectDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ],
      declarations: [
        SelectDowngradeContainer
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
