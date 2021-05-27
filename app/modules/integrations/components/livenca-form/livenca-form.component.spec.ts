import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivencaFormComponent } from './livenca-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { IntegrationsModule } from '../../integrations.module';

describe('LivencaFormComponent', () => {
  let component: LivencaFormComponent;
  let fixture: ComponentFixture<LivencaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        IntegrationsModule.forRoot(false)
      ],
      declarations: [LivencaFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivencaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
