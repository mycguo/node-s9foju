import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStoreSettingsComponent } from './data-store-settings.component';
import { SharedModule } from '../../../shared/shared.module';
import { DataStoreSettingsDisplayNamePipe } from './pipes/data-store-settings-display-name.pipe';

describe('DataStoreSettingsComponent', () => {
  let component: DataStoreSettingsComponent;
  let fixture: ComponentFixture<DataStoreSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ],
      declarations: [
        DataStoreSettingsComponent,
        DataStoreSettingsDisplayNamePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataStoreSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
