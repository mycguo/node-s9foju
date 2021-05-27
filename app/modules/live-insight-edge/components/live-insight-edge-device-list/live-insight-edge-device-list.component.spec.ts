import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInsightEdgeDeviceListComponent } from './live-insight-edge-device-list.component';
import {GridModule} from '../../../grid/grid.module';
import {LiveInsightEdgeModule} from '../../live-insight-edge.module';
import {By} from '@angular/platform-browser';
import {MockComponent} from 'ng-mocks';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {GridComponent} from '../../../grid/components/grid/grid.component';
import {TableStringFilterComponent} from '../../../grid/components/filters/table-string-filter/table-string-filter.component';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';
import {SelectComponent} from '../../../shared/components/form/select/select.component';

describe('LiveInsightEdgeDeviceListComponent', () => {
  let component: LiveInsightEdgeDeviceListComponent;
  let fixture: ComponentFixture<LiveInsightEdgeDeviceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LiveInsightEdgeModule.forRoot(false)],
      declarations: [
        MockComponent(ButtonComponent),
        MockComponent(GridComponent),
        MockComponent(TableStringFilterComponent),
        MockComponent(SpinnerComponent),
        MockComponent(SelectComponent)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInsightEdgeDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make column filters inactive if there is an error message', (done) => {
    setTimeout(() => {
      component.errorMessage = 'error message';
      component.isLoading = false;
      fixture.detectChanges();
      const columnFilters = fixture.debugElement.query(By.css('nx-text-filter input'));
      const isDisabled = columnFilters.attributes['ng-reflect-is-disabled'];
      expect(isDisabled).toBeTruthy();
      done();
    }, 1);
  });

  it('should make column filters inactive if there is an async error message', (done) => {
    setTimeout(() => {
      component.errorMessage = 'error message';
      component.isLoading = false;
      fixture.detectChanges();
      const columnFilters = fixture.debugElement.query(By.css('nx-text-filter input'));
      const isDisabled = columnFilters.attributes['ng-reflect-is-disabled'];
      expect(isDisabled).toBeTruthy();
      done();
    }, 1);
  });
});
