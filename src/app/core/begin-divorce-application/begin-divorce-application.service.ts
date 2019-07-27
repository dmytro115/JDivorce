import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { Client } from '../../core/client/client.model';
import { MixpanelService } from '../../core/mixpanel/mixpanel.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BeginDivorceApplicationService {
  private readonly BEGIN_APP_URL = '/api/authentication/guest_signup';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly mixpanelService: MixpanelService
  ) { }

  beginApplication(from: string): Observable<any> {
    return this.http.post(this.BEGIN_APP_URL, null, httpOptions)
      .pipe(
        catchError(this.handleError('beginApplication', []))
      )
      .pipe(map((res: any) => {
        if (res && res.access_token) {
          this.mixpanelService.track('Begin Application', { from });
          const user = this.authService.getCurrentUser();
          if (!user || !user['email']) {
            this.authService.setCurrentUser(null, res);
          }
        }
        return new Client().deserialize(res.user);
      }));
  }

  checkoutPlan(from: string): Observable<any> {
    return this.http.post(this.BEGIN_APP_URL, null, httpOptions)
      .pipe(
        catchError(this.handleError('checkoutPlan', []))
      )
      .pipe(map((res: any) => {
        if (res && res.access_token) {
          this.mixpanelService.track('Add to Cart', { from });
          const user = this.authService.getCurrentUser();
          if (!user || !user['email']) {
            this.authService.setCurrentUser(null, res);
          }
        }
        return new Client().deserialize(res.user);
      }));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
