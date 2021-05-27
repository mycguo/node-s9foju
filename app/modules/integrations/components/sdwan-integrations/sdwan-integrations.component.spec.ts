import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SdwanIntegrationsComponent} from './sdwan-integrations.component';
import {CommonIntegrationsPanelComponent} from '../common-integrations/common-integrations-panel/common-integrations-panel.component';
import {CardComponent} from '../../../shared/components/card/card.component';
import {CommonIntegrationsDisplayComponent} from '../common-integrations/common-integrations-display/common-integrations-display.component';
import {KeyValueListComponent} from '../../../shared/components/key-value-list/key-value-list.component';
import {CommonModule} from '@angular/common';
import {KeyValueListItemDirective} from '../../../shared/components/key-value-list/key-value-list-item/key-value-list-item.directive';
import {StatusIndicatorComponent} from '../../../shared/components/status-indicator/status-indicator.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BasicIntegrationFormComponent} from '../basic-integration-form/basic-integration-form.component';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';
import {NoDataMessageComponent} from '../../../shared/components/no-data-message/no-data-message.component';
import {SimpleAlertComponent} from '../../../shared/components/simple-alert/simple-alert.component';
import {TextButtonComponent} from '../../../shared/components/text-button/text-button.component';
import {ButtonListDirective} from '../../../shared/directives/button-list/button-list.directive';
import {SimpleInputComponent} from '../../../shared/components/form/simple-input/simple-input.component';
import {ColComponent} from '../../../shared/components/col/col.component';
import {RowComponent} from '../../../shared/components/row/row.component';
import {FormFieldComponent} from '../../../shared/components/form/form-field/form-field.component';
import {SdwanFormComponent} from '../sdwan-form/sdwan-form.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';


describe('SdwanIntegrationsComponent', () => {
  let component: SdwanIntegrationsComponent;
  let fixture: ComponentFixture<SdwanIntegrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      declarations: [
        SdwanIntegrationsComponent,
        CommonIntegrationsPanelComponent,
        SdwanFormComponent,
        CardComponent,
        CommonIntegrationsDisplayComponent,
        KeyValueListComponent,
        KeyValueListItemDirective,
        StatusIndicatorComponent,
        BasicIntegrationFormComponent,
        ButtonComponent,
        SpinnerComponent,
        NoDataMessageComponent,
        SimpleAlertComponent,
        TextButtonComponent,
        ButtonListDirective,
        SimpleInputComponent,
        ColComponent,
        RowComponent,
        FormFieldComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {hasBackdrop: false} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SdwanIntegrationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
