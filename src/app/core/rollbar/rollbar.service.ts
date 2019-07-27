import { ErrorHandler, Injectable, Inject, isDevMode, InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

import * as Rollbar from "rollbar";

export const rollbarConfig = {
  accessToken: environment.rollbar.accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  verbose: true,
  checkIgnore: () => isDevMode()
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable({providedIn: 'root'})
export class RollbarErrorHandler implements ErrorHandler {
  constructor(
    @Inject(RollbarService) private rollbar: Rollbar,
    private authService: AuthService
  ) { }

  handleError(err: any): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.rollbar.configure({
        payload: {
          client: {
            javascript: {
              source_map_enabled: true,
              guess_uncaught_frames: true,
              code_version: 1
            }
          },
          person: {
            id: currentUser.id, // required
            username: currentUser.email,
            email: currentUser.email
          }
        }
      });
    }

    console.log(err);
    this.rollbar.error(err.originalError || err);
  }
}
