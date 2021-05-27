import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {ApicemFormComponent} from './apicem-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import IIntegrationsValidate from '../../../../../../../project_typings/api/integrations/IIntegrationsValidate';
import {Component} from '@angular/core';
import ConfigurationEnum from '../../../../../../../project_typings/enums/configuration.enum';
import {SharedModule} from '../../../shared/shared.module';
import {IntegrationsModule} from '../../integrations.module';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apicem-form-host',
  template: `
    <nx-apicem-form [apicem]="apicem"></nx-apicem-form>
  `
})
class ApicemFormHostComponent {
  apicem: IIntegrationsValidate = {
    config: {
      hostname: 'host',
      username: 'user'
    },
    status: ConfigurationEnum.VALID
  };
}

describe('ApicemFormComponent', () => {
  let component: ApicemFormHostComponent;
  let fixture: ComponentFixture<ApicemFormHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        IntegrationsModule.forRoot(false)
      ],
      declarations: [
        ApicemFormHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApicemFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
