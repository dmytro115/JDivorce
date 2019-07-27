import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { Client, ClientService } from '../core';

@Injectable()
export class ClientResolve implements Resolve<Client> {
  constructor(private clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client> {
    return this.clientService.getClient();
  }
}
