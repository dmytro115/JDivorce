import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, BaseService } from '../../core';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService extends BaseService {
  private static readonly BASE = '/api/users/questionnaire';
  private readonly SUBMIT_QUESTIONNAIRE = '/api/users/questionnaire/submit';
  private readonly SUBMIT_RETRIEVE = '/api/users/questionnaire/retrieve';
  private readonly FETCH_ALL = '/api/users/questionnaire/all';
  private readonly FETCH_BLOG_POSTS = '/api/wordpress/retrieve';

  constructor(http: HttpClient, private readonly authService: AuthService) {
    super(http);
  }

  // tslint:disable-next-line: variable-name
  show(clientId: string, workflow_type: string, workflow_stage: string): Observable<any> {
    return this.get(this.makeUrl(clientId), { workflow_type, workflow_stage }, 'show');
  }

  submit(clientId: string, qid: string, response: any): Observable<any> {
    const client_id = this.fetchClientId(clientId);
    return this.post(this.SUBMIT_QUESTIONNAIRE, { client_id, qid, response }, 'submit');
  }

  retrieve(clientId: string, qid: string, no_edit = false): Observable<any> {
    const client_id = this.fetchClientId(clientId);
    return this.post(this.SUBMIT_RETRIEVE, { client_id, qid, no_edit }, 'retrieve');
  }

  edit(clientId: string, qid: string): Observable<any> {
    const client_id = this.fetchClientId(clientId);
    return this.post(this.SUBMIT_RETRIEVE, { client_id, qid }, 'edit');
  }

  fetchAll(clientId: string, workflow_type: string): Observable<any> {
    const client_id = this.fetchClientId(clientId);
    return this.post(this.FETCH_ALL, { client_id, workflow_type }, 'all');
  }

  updateResponse(clientId: string, qid: string, response: any): Observable<any> {
    const client_id = this.fetchClientId(clientId);
    return this.post('/api/users/questionnaire/update_response', { client_id, qid, response }, 'updateResponse');
  }

  fetchBlogPosts(clientId: string, categories: Array<number>): Observable<any> {
    const client_id = this.fetchClientId(clientId);
    return this.post(this.FETCH_BLOG_POSTS, { client_id, categories }, 'wordpress blogs');
  }

  protected baseUrl(): string {
    return QuestionnaireService.BASE;
  }

  private fetchClientId(clientId: string) {
    if (!clientId) {
      const currentUser = this.authService.getCurrentUser();
      return currentUser['id'];
    }
    return clientId;
  }
}
