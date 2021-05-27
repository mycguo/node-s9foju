import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpComponent } from './pop-up.component';
import { POP_UP_DATA } from './const/pop-up.token';
import { PopUpRef } from './pop-up-ref';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';

describe('PopUpComponent', () => {
  let component: PopUpComponent<any>;
  let fixture: ComponentFixture<PopUpComponent<any>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, OverlayModule ],
      declarations: [ PopUpComponent ],
      providers: [
        {
          provide: POP_UP_DATA,
          useValue: {}
        },
        {
          provide: PopUpRef,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
