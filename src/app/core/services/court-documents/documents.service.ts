import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { BaseService } from '../base-service';
import { Document } from './document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService extends BaseService {
  private static readonly BASE = '/api/users/documents';

  constructor(http: HttpClient, private readonly authService: AuthService) {
    super(http);
  }

  // tslint:disable-next-line: variable-name
  generate(workflow_type: string): Observable<any> {
    return this.post(this.makeUrl('generate'), { client_id: this.authService.getClientId(), workflow_type }, 'generate');
  }

  // tslint:disable-next-line: variable-name
  generateZip(workflow_type: string): Observable<any> {
    return this.post(this.makeUrl('generate_zip'), { client_id: this.authService.getClientId(), workflow_type }, 'generateZip');
  }

  // tslint:disable-next-line: variable-name
  list(workflow_type: string): Observable<any> {
    return this.get(this.makeUrl(), { client_id: this.authService.getClientId(), workflow_type }, 'list');
  }

  // tslint:disable-next-line: variable-name
  show(document_id: string, document_type: string): Observable<Document> {
    // base64 encode the id looks like "DOC15.docx", and the text after the period isn't included in regular query args
    // the API will base64 decode
    return this.get(this.makeUrl(btoa(document_id)), { client_id: this.authService.getClientId(), document_type }, 'show');
  }

  zip(): Observable<any> {
    return this.get(this.makeUrl(`zip/${this.authService.getClientId()}`), {}, 'zip');
  }

  protected baseUrl(): string {
    return DocumentsService.BASE;
  }
}
