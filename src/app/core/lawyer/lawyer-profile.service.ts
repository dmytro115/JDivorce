import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { BaseService } from '../../core/services/base-service';
import { ProfessionalProfile } from './professional-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class LawyerProfileService extends BaseService {
  private static readonly BASE = '/api/lawyers/professional_profile';

  constructor(http: HttpClient, private readonly authService: AuthService) { super(http); }

  listPublic(limit?: number): Observable<Array<ProfessionalProfile>> {
    return this.get(this.makeUrl('list_public') , { limit }, 'list_public');
  }

  show(slug: string): Observable<ProfessionalProfile> {
    return this.get(this.makeUrl(slug), {}, 'show');
  }

  // tslint:disable-next-line: variable-name
  list(limit = 15, plan_ids: Array<string> = [], show_distance = false): Observable<Array<ProfessionalProfile>> {
    return this.get(this.makeUrl(), { limit, plan_ids, show_distance }, 'list');
  }

  showDefaultPlans(): Observable<Array<any>> {
    return this.get(this.makeUrl('show_default_plans'), {}, 'showDefaultPlans');
  }

  showUnfilledStatus(): Observable<any> {
    return this.get(this.makeUrl('show_unfilled_status'), {}, 'showUnfilledStatus');
  }

  showPlanQuestionnaireDefinition(): Observable<any> {
    return this.get(this.makeUrl('show_plan_questionnaire_definition'), {}, 'showPlanQuestionnaireDefinition');
  }

  update(lawyer: any): Observable<ProfessionalProfile> {
    return this.put(this.makeUrl(this.authService.getCurrentUser().id), lawyer, 'update');
  }

  updateProfileImage(file: any, base64: any): Observable<string> {
    const data = {
      file_data: base64,
      file_name: file.name,
      file_type: file.type
    };

    return this.put(this.makeUrl('update_profile_image'), data, 'updateProfileImage');
  }

  updatePlans(response: any): Observable<ProfessionalProfile> {
    return this.put(this.makeUrl('update_plans'), { response }, 'updatePlans');
  }

  protected baseUrl(): string {
    return LawyerProfileService.BASE ;
  }
}
