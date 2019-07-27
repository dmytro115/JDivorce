import { Component, OnInit } from '@angular/core';

import { StripeCheckoutOrder } from '../../../../client/orders/stripe-checkout-order.component';
import { PrintAppOrder } from '../../../../client/orders/print-app-order.model';
import { LegalCourier } from '../../../../client/orders/legal-courier-order.model';
import { LegalProfessional } from '../../../../client/orders/legal-professional-order.model';
import { AuthService, PNotifyService } from '../../../../core';

@Component({
  selector: 'app-filing-documents',
  templateUrl: './filing-documents.component.html',
  styleUrls: ['./filing-documents.component.scss']
})
export class FilingDocumentsComponent implements OnInit {
  docsParams = {
    postURL: '/api/client/generate_documents',
    progressFlagKey: 'is_gen_docs',
    documentsKey: 'google_documents'
  }

  offers = [
    {
      instance: PrintAppOrder,
      title: 'Want the completed application printed and mailed to you? Total $10.',
      description: 'In case you don\'t have a printer, we can mail you a printed copy of your completed application via USPS Priority Mail with the tracking number.'
    },
    {
      instance: LegalCourier,
      title: 'Legal Courier. Total $69.',
      description: 'Have a legal courier serve your spouse You will receive the proof of delivery in person.'
    },
    {
      instance: LegalProfessional,
      title: 'Have a legal professional file your papers. Total $400.',
      description: 'Legal professional will visit your local court to file Price includes the $340 government fees.'
    }
  ];

  constructor(
    private authService: AuthService,
    private stripeCheckoutOrder: StripeCheckoutOrder,
    private pnotify: PNotifyService
  ) { }

  ngOnInit() {
  }

  buyNow(instance) {
    const currentUser = this.authService.getCurrentUser();

    this.stripeCheckoutOrder.create(new instance(currentUser), () => {
      this.pnotify.get().success({
        text: "Your order is confirmed.",
        delay: 4000
      });
    }, () => {
      this.pnotify.get().error({
        text: "Something went wrong during the payment process.",
        delay: 4000
      });
    })
  }
}
