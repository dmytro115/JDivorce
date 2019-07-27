import { async, ComponentFixture, TestBed, fakeAsync, tick, getTestBed, inject } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { PNotifyService, UploadDocumentService, UserUploadedDocument } from '../../../core';
import { TestModule } from '../../../test/test.module';
import { UploadDocumentsComponent } from './upload-documents.component';
import { AuthService } from '../../../core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NumberFoundLegacy } from 'libphonenumber-js';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { Key } from 'protractor';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';

const translations: any = { CARDS_TITLE: 'This is a test' };

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('UploadDocumentsComponent', () => {
  let component: UploadDocumentsComponent;
  let fixture: ComponentFixture<UploadDocumentsComponent>;
  let injector: TestBed;
  let authService: AuthService;
  let uploadDocumentService: UploadDocumentService;
  let userUploadedDocument: UserUploadedDocument;
  let spinner;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadDocumentsComponent],
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        TestModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
      providers: [PNotifyService, UploadDocumentService, AuthService, NgxSpinnerService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    injector = getTestBed();
    authService = injector.get(AuthService);
    uploadDocumentService = injector.get(UploadDocumentService);
    spinner = injector.get(NgxSpinnerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should upload file', fakeAsync(() => {
    const mockFile = new File(['testcontent'], 'test-file.jpg', { lastModified: Date.now(), type: 'image/jpeg' });
    const mockEvent = { target: { files: [mockFile] } };
    spyOn(uploadDocumentService, 'upload').and.returnValue(of({}));
    spyOn(component.pnotify, 'success').and.callThrough();
    spyOn(spinner, 'show').and.callThrough();
    fixture.detectChanges();
    component.fileUpload(mockEvent);
    tick(15000);
    expect(spinner.show).toHaveBeenCalled();
  }));

  it('it should delete file', fakeAsync(() => {
    let mockDocument_key;
    mockDocument_key = 'test';
    spyOn(uploadDocumentService, 'delete').and.returnValue(of({}));
    spyOn(component.pnotify, 'success').and.callThrough();
    spyOn(spinner, 'show').and.callThrough();
    fixture.detectChanges();
    component.delete(mockDocument_key);
    tick(15000);

    expect(spinner.show).toHaveBeenCalled();
  }));
});
