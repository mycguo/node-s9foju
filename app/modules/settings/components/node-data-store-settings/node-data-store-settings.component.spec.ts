import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDataStoreSettingsComponent } from './node-data-store-settings.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {LoggerTestingModule} from '../../../logger/logger-testing/logger-testing.module';

describe('NodeDataStoreSettingsComponent', () => {
  let component: NodeDataStoreSettingsComponent;
  let fixture: ComponentFixture<NodeDataStoreSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        NodeDataStoreSettingsComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeDataStoreSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
