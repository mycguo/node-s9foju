import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {LiveInsightEdgeAddDeviceModalContainer} from './live-insight-edge-add-device-modal.container';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import {IntegrationsModule} from '../../../integrations/integrations.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';


describe('LiveInsightEdgeAddDeviceModalContainer', () => {
  let component: LiveInsightEdgeAddDeviceModalContainer;
  let fixture: ComponentFixture<LiveInsightEdgeAddDeviceModalContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IntegrationsModule.forRoot(false),
        LiveInsightEdgeModule.forRoot(false),
        HttpClientTestingModule,
        MatDialogModule,
        LoggerTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeAddDeviceModalContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
