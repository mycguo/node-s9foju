import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip.component';
import {ToString} from '../../interfaces/to-string';
import {Colorable} from '../../interfaces/colorable';
import {Color} from '../../../../models/color';
import {ComponentBgColorClassEnum} from 'src/app/constants/component-bg-color-class.enum';
import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';

class SampleData implements ToString, Colorable {
  color: Color;

  constructor() {
    this.color = new Color(ComponentBgColorClassEnum.NORMAL);
  }

  toString(): string {
    return 'sample';
  }
}

@Component({
  template: `<nx-chip [value]="data" [color]="data.color"></nx-chip>`,
})
export class ChipHostComponent {
  data = new SampleData();
}

describe('ChipComponent', () => {
  let component: ChipHostComponent;
  let fixture: ComponentFixture<ChipHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
