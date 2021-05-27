import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {IntegrationsModule} from '../../integrations.module';
import {SdwanFormComponent} from './sdwan-form.component';
import IIntegrations from '../../../../../../../project_typings/api/integrations/IIntegrations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sdwan-form-host',
  template: `
    <nx-sdwan-form [sdwanIntegrations]="sdwanIntegrations"></nx-sdwan-form>
  `
})
class SdwanFormHostComponent {
  sdwanIntegrations: IIntegrations = {
    hostname: 'host',
    username: 'user'
  };
}

describe('SdwanFormComponent', () => {
  let component: SdwanFormHostComponent;
  let fixture: ComponentFixture<SdwanFormHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        IntegrationsModule.forRoot(false)
      ],
      declarations: [
        SdwanFormHostComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdwanFormHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
