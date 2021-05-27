import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';

import {SortableListDowngradeContainer} from './sortable-list-downgrade.container';
import {OldSortableListComponent} from '../../../modules/shared/components/old-sortable-list/old-sortable-list.component';
import {InfoBtnComponent} from '../../../modules/shared/components/info-btn/info-btn.component';
import {ToggleComponent} from '../../../modules/shared/components/form/toggle/toggle.component';

describe('SortableListDowngradeContainer', () => {
  let component: SortableListDowngradeContainer;
  let fixture: ComponentFixture<SortableListDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DragDropModule,
        FormsModule
      ],
      declarations: [
        SortableListDowngradeContainer,
        OldSortableListComponent,
        InfoBtnComponent,
        ToggleComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableListDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
