import { HttpClient, HttpEvent, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ngf, ngfModule } from 'angular-file';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadDocumentService } from '../../../core/upload-document/upload-document.service';
import { UserUploadedDocument } from '../../../core/upload-document/user-uploaded-document.interface';

@Component({
  selector: 'app-jd-questionnaire-upload',
  templateUrl: './jd-questionnaire-upload.component.html',
  styleUrls: ['./jd-questionnaire-upload.component.scss']
})
export class JDQuestionnaireUploadComponent implements OnInit {
  @Input() hasError = false;
  @Input() error = '';
  @Input() value = '';
  @Input() style = '';
  @Input() tag = '';

  files: Array<File | UserUploadedDocument> = [];
  validComboDrag: boolean;
  invalidComboDrag: boolean;
  maxSize = 1048576;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<{}>;
  progress = 0;
  documents: Array<UserUploadedDocument> = [];

  constructor(
    private readonly http: HttpClient,
    private readonly uploadDocumentService: UploadDocumentService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.uploadDocumentService.list(this.tag).subscribe((documents: Array<UserUploadedDocument>) => {
      documents.forEach((document: UserUploadedDocument) => this.documents.push(document));
      this.changeDetectorRef.detectChanges();
    });
  }

  // tslint:disable-next-line: no-empty
  onFileChange(file: File): void {}

  onFilesChange(files: any): void {
    this.progress = 0;
    files.forEach((file: File) => {
      this.upload(file);
    });
    this.files = [];
  }

  deleteFile(event: Event, index: number, documentKey: string): void {
    event.preventDefault();
    this.files.splice(index, 1);
    if (documentKey) {
      this.uploadDocumentService.delete(documentKey).subscribe();
    }
    this.documents.splice(this.documents.findIndex((document: UserUploadedDocument) => document.document_key === documentKey), 1);
  }

  private upload(file: File): void {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    this.uploadFormData(formData);
  }

  private uploadFormData(formData: FormData): Subscription {
    const url = '/api/users/upload_documents/upload_form_data';
    const httpParams = new HttpParams().set('tag', this.tag);
    const req = new HttpRequest<FormData>('POST', url, formData, { reportProgress: true, params: httpParams });

    return (this.httpEmitter = this.http.request(req).subscribe(
      event => {
        this.httpEvent = event;

        if (event instanceof HttpResponse) {
          delete this.httpEmitter;
          this.documents.push(event.body['response']);
          this.changeDetectorRef.detectChanges();
        }
      },
      error => console.log('Error Uploading', error)
    ));
  }
}
