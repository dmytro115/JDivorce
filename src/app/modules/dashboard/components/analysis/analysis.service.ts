import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../core/services/base-service';
import { AuthService } from '../../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService extends BaseService { 
  constructor(http: HttpClient, private authService: AuthService) { super(http); }

  completeAnalysis(workflow_type): Observable<any> {
    return this.post(
      '/api/users/domestic_violence/complete_analysis',
      { workflow_type },
      'completeAnalysis');
  }
}
