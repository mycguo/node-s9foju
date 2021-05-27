import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AlertManagementSidebarThresholdQosComponent} from './alert-management-sidebar-threshold-qos.component';


describe('AlertManagementSideBarThresholdQosComponent', () => {
  let component: AlertManagementSidebarThresholdQosComponent;
  let fixture: ComponentFixture<AlertManagementSidebarThresholdQosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertManagementSidebarThresholdQosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagementSidebarThresholdQosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
