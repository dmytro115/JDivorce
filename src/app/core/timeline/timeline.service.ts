import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TimelineStep } from '../../shared/timeline/timeline-step.model';
import { AuthService } from '../auth';
import { BaseService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class TimelineService extends BaseService {
  private static readonly BASE = '/api/timeline';

  constructor(http: HttpClient, private readonly authService: AuthService) {
    super(http);
  }

  // tslint:disable-next-line: variable-name
  show(workflow_type: string): Observable<Array<TimelineStep>> {
    return this.get(this.makeUrl(this.authService.getClientId()), { workflow_type }, 'show');
  }

  protected baseUrl(): string {
    return TimelineService.BASE;
  }
}
