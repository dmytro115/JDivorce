import { Injectable } from '@angular/core';
import { ActionCableService, Cable } from 'angular2-actioncable';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root'
})
export class ActionCableWrapperService {
  constructor(private readonly actionCableService: ActionCableService, private readonly authService: AuthService) {}

  get cableService(): ActionCableService {
    return this.actionCableService;
  }

  get cable(): Cable {
    return this.cableService.cable(`${environment.actionCableUrl}/cable/${btoa(this.authService.getCurrentUser().token)}`);
  }
}
