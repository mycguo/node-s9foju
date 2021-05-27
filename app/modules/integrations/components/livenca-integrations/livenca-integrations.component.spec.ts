import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivencaIntegrationsComponent } from './livenca-integrations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { IntegrationsModule } from '../../integrations.module';
import { LivencaFormComponent } from '../livenca-form/livenca-form.component';
import { BasicIntegrationFormComponent } from '../basic-integration-form/basic-integration-form.component';

describe('ConfiguredLivencaIntegrationsComponent', () => {
  let component: LivencaIntegrationsComponent;
  let fixture: ComponentFixture<LivencaIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        IntegrationsModule.forRoot(false)
      ],
      declarations: [
        LivencaIntegrationsComponent,
        LivencaFormComponent,
        BasicIntegrationFormComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivencaIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
