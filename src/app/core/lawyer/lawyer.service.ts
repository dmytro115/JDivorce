import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiResponse } from '../../core/services/api-response.model';
import { Lawyer } from './lawyer.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LawyerService {
  private readonly LAWYER_URL = '/api/user/get_lawyer_public';

  constructor(private readonly http: HttpClient) {}

  getLawyer(): Observable<Lawyer> {
    return this.http.post<Lawyer>('/api/user/get_lawyer', null, httpOptions);
  }

  getLawyerClients(lawyer_id: string): Observable<Lawyer> {
    return this.http.post<Lawyer>('/api/user/get_lawyer_clients', null, httpOptions);
  }

  sendContactEmail(data) {
    return this.http.post<Lawyer>(
      '/api/lawyer/send_feedback_from_profile',
      { data },
      httpOptions
    );
  }

  inviteClient(client) {
    return this.http.post<Lawyer>(
      '/api/lawyer/invite_client',
      client,
      httpOptions
    );
  }

  notifyClient(email: string, content: string) {
    return this.http.post<Lawyer>(
      '/api/lawyer/send_email',
      { email, content },
      httpOptions
    );
  }

  saveGeneralSettings(content) {
    return this.http.post<Lawyer>(
      '/api/lawyers/settings',
      { lawyer : { general_settings: content } },
      httpOptions
    );
  }

  cloneApplication(data) {
    let url = '/api/lawyer/create_client_application';
    if (data['source_email']) {
      url = '/api/lawyer/clone_client_application';
    }

    return this.http.post(url, data, httpOptions);
  }
}
