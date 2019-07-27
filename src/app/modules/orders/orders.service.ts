import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApiResponse } from '../../core/services/api-response.model';
import { BaseService } from '../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class BillingOrdersService extends BaseService {
  private GET_ORDER_STATES: string = '/api/orders';

  constructor(private _http: HttpClient) { super(_http); }

  getOrderStates(pageNum): Observable<any> {
    return this._http.get(this.GET_ORDER_STATES + '?page=' + pageNum);
  }

  retrieve(order_id: string): Observable<any> {
    return this.post('/api/orders/retrieve', { order_id });
  }
}
