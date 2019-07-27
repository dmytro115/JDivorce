import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutStoreService {
  // The subject is an Order.
  private _wizardNextStep = new Subject<any>();

  // The subject is a "source". This is to differentiate between different
  // payment functions that exist on the same page, otherwise all the subscrptions
  // to "contactInfo" will run at the same time.
  private _checkContactForm = new Subject<string>();
  // The contact form will emit it's data.
  private contactInfo = new Subject<any>();

  wizardNextStep$ = this._wizardNextStep.asObservable();
  checkContactForm$ = this._checkContactForm.asObservable();
  contactInfo$ = this.contactInfo.asObservable();

  constructor() { }

  wizardNextStep(order: any) {
    this._wizardNextStep.next(order);
  }

  checkContactForm(source) {
    this._checkContactForm.next(source);
  }

  emitContactInfo(contactInfo) {
    this.contactInfo.next(contactInfo);
  }
}
