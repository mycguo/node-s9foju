import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomApplicationsTableComponent } from './custom-applications-table.component';

describe('CustomApplicationsTableComponent', () => {
  let component: CustomApplicationsTableComponent;
  let fixture: ComponentFixture<CustomApplicationsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomApplicationsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomApplicationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
