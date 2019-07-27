import { LoadScriptService } from '../../core';
import { environment } from './../../../environments/environment';
import { StripeService } from './../../core/stripe/stripe.service';
import { Order } from './order.model';

export class StripeCheckoutOrder {
  constructor(
    private readonly stripeService: StripeService,
    private readonly loadScriptService: LoadScriptService
  ) {
    this.loadJSLibrary([
      'https://js.stripe.com/v3/',
      'https://checkout.stripe.com/checkout.js'
    ]);
  }

  create(order: Order, success: Function, error: Function): void {
    const handler = StripeCheckout.configure({
      key: environment.stripe.publishableKey,
      image: '/assets/logo-spaced.png',
      name: 'JDivorce',
      description: order.description,
      locale: 'auto',
      email: order.email,
      amount: order.amount,
      token: (response: any) => {
        this.processCheckout(response, order.type, success, error);
      }
    });

    handler.open();
  }

  processCheckout(
    response: any,
    type: string,
    success: Function,
    error: Function
  ): void {
    this.stripeService.purchaseOrder(response.id, type).subscribe(
      (result: any) => {
        success(result);
      },
      err => {
        error(err);
      }
    );
  }

  private async loadJSLibrary(urls: Array<string>): Promise<any> {
    const promises = urls.map(
      // tslint:disable-next-line: promise-function-async
      (url: string) =>
        new Promise(resolve => {
          const script: HTMLScriptElement = document.createElement('script');
          script.addEventListener('load', r => {
            resolve(url);
          });
          script.src = url;
          document.head.appendChild(script);
        })
    );

    return new Promise(resolve => {
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }
}
