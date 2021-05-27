import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {OldSortableListComponent} from './old-sortable-list.component';
import {SharedModule} from '../../shared.module';

describe('SortableListComponent', () => {
  let component: OldSortableListComponent;
  let fixture: ComponentFixture<OldSortableListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        DragDropModule
      ],
      declarations: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldSortableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
