import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../services/base-service';
import { UserUploadedDocument } from './user-uploaded-document.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadDocumentService extends BaseService {
  private readonly UPLOAD_DOCUMENT_URL = '/api/users/upload_documents/upload_user_document';
  private readonly UPDATE_DESCRIPTION_URL = '/api/users/upload_documents/update_user_document_description';
  private readonly LIST_DOCUMENT_URL = '/api/users/upload_documents/list_user_documents';
  private readonly DELETE_DOCUMENT_URL = '/api/users/upload_documents/delete_user_document';
  private readonly GET_DOCUMENT_URL = '/api/users/upload_documents/retrieve_user_document';

  constructor(private readonly _http: HttpClient, private readonly authService: AuthService) {
    super(_http);
  }

  upload(file_name: string, file_type: string, file_data: string): Observable<UserUploadedDocument> {
    return this.post(this.UPLOAD_DOCUMENT_URL, { user_id: this.authService.getClientId(), file_name, file_type, file_data }, 'upload');
  }

  list(tag?: string): Observable<Array<UserUploadedDocument>> {
    return this.post(this.LIST_DOCUMENT_URL, { user_id: this.authService.getClientId(), tag }, 'list');
  }

  update(name: string, document_key: string, description: string): Observable<UserUploadedDocument> {
    return this.post(this.UPDATE_DESCRIPTION_URL, { name, document_key, description }, 'update');
  }

  delete(document_key: string): Observable<boolean> {
    return this.post(this.DELETE_DOCUMENT_URL, { document_key }, 'delete');
  }

  retrieve(document_key: string): Observable<UserUploadedDocument> {
    return this.post(this.GET_DOCUMENT_URL, { user_id: this.authService.getClientId(), document_key }, 'get');
  }
}
