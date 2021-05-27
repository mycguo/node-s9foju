import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared.module';
import {SimpleInputComponent} from './simple-input.component';

describe('SimpleInputComponent', () => {
  let component: SimpleInputComponent;
  let fixture: ComponentFixture<SimpleInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ],
      declarations: [
        SimpleInputComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
