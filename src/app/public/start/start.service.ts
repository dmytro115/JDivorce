import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, MixpanelService } from '../../core';
import { AuthService } from '../../core/auth/auth.service';
import { BaseService } from '../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class StartService extends BaseService {
  constructor(http: HttpClient, private readonly authService: AuthService, private readonly mixpanelService: MixpanelService) {
    super(http);
  }

  beginAsGuest(): Observable<any> {
    return this.postAny('/api/authentication/guest_signup', {}, 'beginAsGuest').pipe(
      map((res: any) => {
        if (res && res.access_token) {
          this.mixpanelService.track('Begin Application', { beginAsGuest: true });
          const user = this.authService.getCurrentUser();
          if (!user || !user['email']) {
            this.authService.setCurrentUser(undefined, res);
          }

          return new Client().deserialize(res.user);
        } else {
          throwError('No auth token found');
        }
      })
    );
  }

  protected baseUrl(): string {
    return undefined;
  }
}
