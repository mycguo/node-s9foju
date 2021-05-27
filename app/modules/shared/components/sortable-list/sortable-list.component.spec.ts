import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SortableListComponent} from './sortable-list.component';

describe('SortableListComponent', () => {
  let component: SortableListComponent<any>;
  let fixture: ComponentFixture<SortableListComponent<any>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SortableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
