import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataSourceManagementCardComponent } from './data-source-management-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from '../../../logger/logger-testing/logger-testing.module';

describe('DataSourceManagementCardComponent', () => {
  let component: DataSourceManagementCardComponent;
  let fixture: ComponentFixture<DataSourceManagementCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      declarations: [ DataSourceManagementCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSourceManagementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
