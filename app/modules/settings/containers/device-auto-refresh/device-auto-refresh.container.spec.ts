import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MockComponent} from 'ng-mocks';
import {CardComponent} from '../../../shared/components/card/card.component';
import {SimpleInputComponent} from '../../../shared/components/form/simple-input/simple-input.component';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {DeviceAutoRefreshComponent} from '../../components/device-auto-refresh/device-auto-refresh.component';
import {ToggleComponent} from '../../../shared/components/form/toggle/toggle.component';

describe('DeviceAutoRefreshComponent', () => {
  let component: DeviceAutoRefreshComponent;
  let fixture: ComponentFixture<DeviceAutoRefreshComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        DeviceAutoRefreshComponent,
        MockComponent(CardComponent),
        MockComponent(SimpleInputComponent),
        MockComponent(ButtonComponent),
        MockComponent(ToggleComponent)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAutoRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
