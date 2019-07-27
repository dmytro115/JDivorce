import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from '../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class StripeService extends BaseService {
  private static BASE: string = '/api/stripe/';
  private PAY_URL: string = '/api/stripe/pay';
  private PURCHASE_ORDER_URL: string = '/api/stripe/purchase_order';
  private PAYPAL_URL: string = '/api/stripe/paypal';
  private PAYPAL_DIRECTLY_URL: string = '/api/stripe/pay_directly';

  constructor(http: HttpClient) { super(http); }

  pay(name: string, lawyer_id: string, stripeToken: string, slot: string, selected_plan: any, contact_info): Observable<any> {
    return this.post(this.url('pay'), { name, lawyer_id, stripeToken, slot, selected_plan, contact_info });
  }

  paypal(): Observable<any> {
    return this.post(this.url('paypal'));
  }

  payDirectly(lawyer_id: string, slot: string, selected_plan: any, contact_info): Observable<any> {
    return this.post(this.url('pay_directly'), { lawyer_id, slot, selected_plan, contact_info });
  }

  purchaseOrder(stripeToken: string, type: string): Observable<any> {
    return this.post(this.url('purchase_order'), { stripeToken, type });
  }

  private url(path: string): string {
    return `${StripeService.BASE}${path}`;
  }
}
