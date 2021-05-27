import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationManagementPageComponent } from './application-management-page.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('ApplicationManagementPageComponent', () => {
  let component: ApplicationManagementPageComponent;
  let fixture: ComponentFixture<ApplicationManagementPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ ApplicationManagementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationManagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
