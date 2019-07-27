import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteChangeService {
  private params = new Subject<Params>();

  params$ = this.params.asObservable();

  constructor() { }

  emitParams(params: Params) {
    this.params.next(params);
  }
}
