import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/services/base-service';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root'
})
export class LawyerRecommendationService extends BaseService {
  private static readonly BASE = '/api/lawyers/recommendations';
  private readonly RECOMMENDED_CONTENT_URL = '/api/lawyers/recommendations/recommended_content';

  constructor(http: HttpClient, private readonly authService: AuthService) {
    super(http);
  }

  recommendedContent(): Observable<any> {
    return this.post(this.RECOMMENDED_CONTENT_URL, undefined, 'recommendedContent');
  }

  // tslint:disable-next-line: variable-name
  show(workflow_type: string, workflow_stage: string): Observable<any> {
    return this.get(this.makeUrl(this.authService.getClientId()), { workflow_type, workflow_stage }, 'show');
  }

  // tslint:disable-next-line: variable-name
  plan(workflow_type: string, workflow_stage: string): Observable<any> {
    return this.get(this.makeUrl('plan'), { workflow_type, workflow_stage }, 'plan');
  }

  protected baseUrl(): string {
    return LawyerRecommendationService.BASE;
  }
}
