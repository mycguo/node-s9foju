import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {LiveInsightEdgeConfigModalContainer} from './live-insight-edge-config-modal.container';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import {IntegrationsModule} from '../../../integrations/integrations.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';


describe('LiveInsightEdgeConfigModalContainer', () => {
  let component: LiveInsightEdgeConfigModalContainer;
  let fixture: ComponentFixture<LiveInsightEdgeConfigModalContainer>;

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
        { provide: MAT_DIALOG_DATA, useValue: {hasBackdrop: false} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeConfigModalContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
