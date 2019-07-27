import { Location } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable,  throwError as observableThrowError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly location: Location,
    private readonly authService: AuthService,
    private readonly injector: Injector
  ) { }

  populateClientId(url: any): string {
    const viewClientId = this.authService.getViewClientId();
    if (viewClientId) {
      url += `?client_id=${viewClientId}`;
    }

    return url;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newRequest: any;
    if (!request.url.startsWith('/assets')) {
      newRequest = request.clone({ url: this.populateClientId(environment.serverUrl + request.url) });
    } else {
      newRequest = request.clone({ url: this.location.prepareExternalUrl(request.url) });
    }

    return next.handle(newRequest).pipe(tap(
      event => {
        // do nothing
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.handleUnauthorized();
            this.authService.currentUser$.next({ user: undefined, expired: true });
          } else if (err.status >= 500) {
            return observableThrowError(err);
          } else if (err.status >= 400) {
            if (err.error && !err.error.errorKey) {
              err.error.errorKey = err.error.message;
            }
          }
        }
      }
    ));
  }

  private handleUnauthorized(): void {
    this.authService.clearStorage();
    this.router.navigate(['auth/login']);
  }
}
