/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FileInputComponent } from './file-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { Component } from '@angular/core';
import { SimpleInputModel } from '../simple-input/models/simple-input.model';
import HtmlInputTypesEnum from '../simple-input/models/html-input-types.enum';

@Component({
  template: `
    <nx-file-input [formControl]="formControl" [inputModel]="inputModel"></nx-file-input>`
})
class FileInputHostComponent {
  formControl: FormControl = new FormControl();
  inputModel: SimpleInputModel = new SimpleInputModel(HtmlInputTypesEnum.file);
}

describe('FileInputComponent', () => {
  let component: FileInputHostComponent;
  let fixture: ComponentFixture<FileInputHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [
        FileInputComponent,
        FileInputHostComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInputHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
