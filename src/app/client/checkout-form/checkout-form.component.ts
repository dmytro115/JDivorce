import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { LoadScriptService, PNotifyService, StripeService } from '../../core';
import { CheckoutStoreService } from '../checkout/checkout-store.service';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {
  @Input() lawyerId: string;
  @Input() plan: any;
  @Input() slotStartTime: any;
  @Input() contact: any;
  @Output() checkoutFormComplete = new EventEmitter<any>();

  checkoutForm: FormGroup;
  card: any;
  formErrorMessage: string;
  paymentButtonDisabled: boolean;
  pnotify: any;
  stripe: any;

  private readonly checkContactFormSource = 'pay';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly stripeService: StripeService,
    private readonly checkoutStoreService: CheckoutStoreService,
    pNotifyService: PNotifyService,
    private readonly loadScriptService: LoadScriptService
  ) {
    this.createCheckoutForm();
    this.pnotify = pNotifyService.get();
  }

  ngOnInit(): void {
    this.loadScriptService.loadJSLibrary(['https://js.stripe.com/v3/', 'https://checkout.stripe.com/checkout.js']).then((response: any) =>  {
      this.setupStripeElements();
    });
    this.checkoutStoreService.contactInfo$.subscribe(
      response => {
        if (response.valid && response.source === this.checkContactFormSource) {
          this.submit(response.value);
        }
      }
    );
  }

  onDestroy(): void {
    // TODO: fix this leak
    // this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  createCheckoutForm(): void {
    this.checkoutForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required])
    });
  }

  setupStripeElements(): void {
    this.stripe = Stripe(environment.stripe.publishableKey); // use your test publishable key
    const elements = this.stripe.elements();

    this.card = elements.create('card', {
      style: {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          lineHeight: '40px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '14px',
          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      }
    });
    this.card.mount('#card-element');
    this.card.on('change', event => {
      this.paymentButtonDisabled = false;
      this.setOutcome(event, undefined);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    // Check if the contact information is filled out.
    this.checkoutStoreService.checkContactForm(this.checkContactFormSource);
  }

  submit(contactInfo: any): void {
    const extraDetails = {
      name: `${contactInfo.firstName} ${contactInfo.lastName}`,
      currency: 'usd',
      address_country: 'US',
      address_state: 'WA'
    };

    this.stripe
      .createToken(this.card, extraDetails)
      .then((result: any) => { this.setOutcome(result, contactInfo); });
  }

  setOutcome(result: any, contactInfo: any): void {
    this.formErrorMessage = undefined;

    if (result.token) {
      const startTime = this.slotStartTime ? this.slotStartTime : undefined;
      const selectedPlan = {
        id: this.plan.id
      };

      this.paymentButtonDisabled = true;
      this.stripeService
        .pay(this.form.name.value, this.lawyerId, result.token.id, startTime, selectedPlan, contactInfo)
        .subscribe(
          (order: any) => {
            this.paymentButtonDisabled = false;
            this.card.clear();
            this.checkoutFormComplete.emit(order);
          },
          error => {
            if (error.status === 403) {
              this.pnotify.error({
                title: 'This email is already being used!',
                text: 'If you already have an account, please login. If not, please use a different email.'
              });
            }
            this.paymentButtonDisabled = false;
          }
        );
    } else if (result.error) {
      this.formErrorMessage = result.error.message;
      setTimeout(() => {
        this.formErrorMessage = result.error.message;
      });
    }
  }

  // Convenience getter for easy access to form fields.
  get form(): { [key: string]: AbstractControl; } {
    return this.checkoutForm.controls;
  }
}
