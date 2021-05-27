import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpslaStatusPopUpComponent } from './ipsla-status-pop-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { POP_UP_DATA } from '../../../shared/components/pop-up/const/pop-up.token';
import { PopUpRef } from '../../../shared/components/pop-up/pop-up-ref';
import { CardComponent } from '../../../shared/components/card/card.component';
import { KeyValueListComponent } from '../../../shared/components/key-value-list/key-value-list.component';
import { KeyValueListItemDirective } from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';

describe('IpslaStatusPopUpComponent', () => {
  let component: IpslaStatusPopUpComponent;
  let fixture: ComponentFixture<IpslaStatusPopUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, OverlayModule ],
      declarations: [ IpslaStatusPopUpComponent, CardComponent, KeyValueListComponent, KeyValueListItemDirective ],
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
    fixture = TestBed.createComponent(IpslaStatusPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
