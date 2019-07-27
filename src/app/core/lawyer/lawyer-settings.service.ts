import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { BaseService } from '../../core/services/base-service';
import { ProfessionalProfile } from './professional-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class LawyerSettingsService extends BaseService {
  private static readonly BASE = '/api/lawyers/settings';

  constructor(http: HttpClient, private readonly authService: AuthService) { super(http); }

  show(): Observable<any> {
    return this.get(this.makeUrl(), {}, 'show');
  }

  update(settings: any): Observable<any> {
    return this.put(this.makeUrl('update'), settings, 'update');
  }

  protected baseUrl(): string {
    return LawyerSettingsService.BASE;
  }
}
