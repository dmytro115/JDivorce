import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/services/api-response.model';
import { Comment } from './comment.model';
import { Post } from './post.model';
import { Form } from './form.model';
import { BaseService } from '../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService extends BaseService {
  private GET_COMMENTS_FOR_FORM: string = '/api/conversations/get_comments_for_form';
  private GET_POSTS_FOR_USER: string = '/api/conversations/get_posts_for_user';
  private GET_POSTS_FOR_CLIENTS: string = '/api/conversations/get_posts_for_clients';
  private ADD: string = '/api/conversations/add';
  private LIST_FORMS_WITH_CONVERSATIONS: string = '/api/conversations/list_forms_with_conversations';
  private GET_POSTS_FOR_FORM: string = '/api/conversations/get_posts_for_form';
  private GET_COMMENTS_FOR_POST: string = '/api/conversations/get_comments_for_post';

  constructor(private _http: HttpClient) { super(_http); }


  addComment(userId: string, content: string, postId: string, formId: string): Observable<Comment> {
    return this.post(this.ADD, { user_id: userId, content: content, post_id: postId, form_id: formId }, 'addComment');
  }

  listFormsWithConversations(): Observable<Form[]> {
    return this.post(this.LIST_FORMS_WITH_CONVERSATIONS, null, 'listFormsWithConversations');
  }

  listFormsWithConversationsByClient(clientId): Observable<Form[]> {
    return this.post(this.LIST_FORMS_WITH_CONVERSATIONS, { client_id: clientId }, 'listFormsWithConversationsByClient');
  }

  getPostsForForm(formId: string): Observable<Post[]> {
    return this.post(this.GET_POSTS_FOR_FORM, { form_id: formId }, 'getPostsForForm');
  }

  getPostsForFormByClient(formId: string, clientId): Observable<Post[]> {
    return this.post(this.GET_POSTS_FOR_FORM, { form_id: formId, client_id: clientId }, 'getPostsForForm');
  }

  getCommentsForPost(postId: string): Observable<Comment[]> {
    return this.post(this.GET_COMMENTS_FOR_POST, { post_id: postId }, 'getCommentsForPost');
  }

  getCommentsForForm(formId: string, clientId: string, lawyerId: string): Observable<Comment[]> {
    return this.post(this.GET_COMMENTS_FOR_FORM, { form_id: formId, client_id: clientId, lawyer_id: lawyerId }, 'getCommentsForForm');
  }

  getPostsForUser(userId: string): Observable<Post[]> {
    return this.post(this.GET_POSTS_FOR_USER, { user_id: userId }, 'getPostsForUser');
  }
}
