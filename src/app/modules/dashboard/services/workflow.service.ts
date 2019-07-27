import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../core/services/api-response.model';
import { BaseService } from '../../../core/services/base-service';
import { Workflow } from './workflow.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService extends BaseService {
  constructor(http: HttpClient) { super(http); }

  retrieve(userId: string, type: string): Observable<Workflow> {
    return this.post('/api/workflows/retrieve', { user_id: userId, type: type}, 'retrieve');
  }
}
