import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService {
  constructor() {}

  init(): void {
    mixpanel.init(environment.mixpanel.apiKey);
  }

  identify(id: string): void {
    mixpanel.identify(id);
  }

  peopleSet(email: string): void {
    mixpanel.people.set({
      $email: email,
      $created: new Date(),
      $last_login: new Date()
    });
  }

  peopleSetLastLogin(): void {
    mixpanel.people.set({
      $last_login: new Date()
    });
  }

  track(id: string, action: any = {}): void {
    mixpanel.track(id, action);
  }
}
