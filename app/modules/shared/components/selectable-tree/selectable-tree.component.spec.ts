import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectableTreeComponent } from './selectable-tree.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: `
    <nx-selectable-tree [formControl]="formControl"></nx-selectable-tree>`
})
class SelectableTreeHostComponent {
  formControl: FormControl = new FormControl([{
    id: '1',
    name: 'Node',
    children: [{
      id: '1-1',
      name: 'Node1',
      enabled: true,
      disabled: false
    }],
    enabled: true,
    disabled: false
  }]);
}

describe('TreeComponent', () => {
  let component: SelectableTreeHostComponent;
  let fixture: ComponentFixture<SelectableTreeHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        SelectableTreeComponent,
        SelectableTreeHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectableTreeHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
