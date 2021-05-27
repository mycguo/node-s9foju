import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeviceCurrentFlowsTabDowngradeContainer} from './device-current-flows-tab-downgrade.container';
import {MockComponent} from 'ng-mocks';
import {DeviceCurrentFlowTabContainer} from '../../../modules/entity/containers/device-current-flow-tab/device-current-flow-tab.container';

describe('DeviceCurrentFlowsTabDowngradeContainer', () => {
  let component: DeviceCurrentFlowsTabDowngradeContainer;
  let fixture: ComponentFixture<DeviceCurrentFlowsTabDowngradeContainer>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(DeviceCurrentFlowTabContainer),
        DeviceCurrentFlowsTabDowngradeContainer
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceCurrentFlowsTabDowngradeContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the contents', () => {
    component.setState({
      deviceSerial: 'x',
      isAutoRefresh: false
    });
    const currentFlowsDowngradeElement: HTMLElement = fixture.nativeElement;
    const container = currentFlowsDowngradeElement.querySelector('#flow-tab-container');
    expect(container).not.toEqual(null);
  });
});
