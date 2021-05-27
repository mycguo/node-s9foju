import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderComponent } from './file-uploader.component';
import {FileExtension} from '../../../pipes/file-name/file-name.pipe';
import {ByteFormattingPipe} from '../../../pipes/byte-formatting/byte-formatting.pipe';
import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'file-uploader-host',
  template: `
    <form [formGroup]="group">
      <nx-file-uploader [formControl]="file" [acceptedFileTypes]="['.txt']"></nx-file-uploader>
    </form>
  `
})
class FileUploaderHostComponent {
  group = new FormGroup({});
  file = new FormControl();
}

describe('FileUploaderComponent', () => {
  let component: FileUploaderHostComponent;
  let fixture: ComponentFixture<FileUploaderHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        FileUploaderComponent,
        FileExtension,
        FileUploaderHostComponent
      ],
      providers: [
        ByteFormattingPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
