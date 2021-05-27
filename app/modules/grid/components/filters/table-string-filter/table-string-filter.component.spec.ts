import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStringFilterComponent } from './table-string-filter.component';
import {FormsModule} from '@angular/forms';

describe('TableStringFilterComponent', () => {
  let component: TableStringFilterComponent;
  let fixture: ComponentFixture<TableStringFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ TableStringFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableStringFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
