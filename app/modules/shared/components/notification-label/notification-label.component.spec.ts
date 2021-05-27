import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NOTIFICATION_LABEL_STATUS_MODIFIER_PREFIX } from './const/notification-label-status-modifier-prefix.const';
import { NotificationLabelStatus } from './enums/notification-label-status.enum';
import { NotificationLabelComponent } from './notification-label.component';

function checkStatusModifierAvailability(
  status: NotificationLabelStatus,
  component: NotificationLabelComponent,
  fixture: ComponentFixture<NotificationLabelComponent>
) {
  component.status = status;
  fixture.detectChanges();
  const validModifier = NOTIFICATION_LABEL_STATUS_MODIFIER_PREFIX + (status || NotificationLabelStatus.INFO);
  expect(fixture.nativeElement.getAttribute('class').split(' ').indexOf(validModifier))
    .not.toEqual(-1, `Host element has no ${!status ? 'default ' : ''}"${validModifier}" classname`);
}

describe('NotificationLabelComponent', () => {
  let component: NotificationLabelComponent;
  let fixture: ComponentFixture<NotificationLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      declarations: [ NotificationLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set proper css status modifier', () => {
    checkStatusModifierAvailability(void 0, component, fixture);
    Object.values(NotificationLabelStatus).forEach((status) => {
      checkStatusModifierAvailability(status, component, fixture);
    });
  });
});
