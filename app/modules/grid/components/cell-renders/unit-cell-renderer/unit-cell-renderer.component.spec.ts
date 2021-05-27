import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCellRendererComponent } from './unit-cell-renderer.component';
import {UnitFormatterPipe} from '../../../../shared/pipes/unit-formatter/unit-formatter.pipe';
import {DecimalPipe} from '@angular/common';

describe('UnitCellRendererComponent', () => {
  let component: UnitCellRendererComponent;
  let fixture: ComponentFixture<UnitCellRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        DecimalPipe
      ],
      declarations: [ UnitCellRendererComponent,
        UnitFormatterPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
