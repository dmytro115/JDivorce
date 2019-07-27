import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { AuthDialogService, AuthService } from '../../../core';
import { QuestionnaireService } from '../../../modules/jd-questionnaire/jd-questionnaire.service';
import { BillingOrdersService } from '../../../modules/orders/orders.service';

import * as moment from 'moment';

@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  order: any;
  appointmentDate: any;
  buttonInfo = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly orders: BillingOrdersService,
    private readonly authService: AuthService,
    private readonly authDialogService: AuthDialogService,
    private readonly questionnaireService: QuestionnaireService
  ) { }

  ngOnInit(): void {
    this.initOrder();
  }

  private initOrder(): void {
    this.route.url.subscribe((url: Array<UrlSegment>) => {
      const confirmation = url[0];
      const orderId = confirmation.parameters.o;
      if (orderId) {
        this.orders.retrieve(orderId).subscribe(order => {
          this.order = order;
          this.appointmentDate = moment(order.appointment_start_at).format('ddd MMMM D[th], ha');
          if (!this.authService.getCurrentUser().email) {
            this.authDialogService.openSignupDialog({
              hideLawyerSignup: true,
              hideLogin: true,
              infoMessage: 'Please register your account and sign up with us so that we can properly track your progress with your lawyer.',
              email: order.client_email
            });
          }
          this.questionnaireService.retrieve(this.authService.getViewClientId(), 'PRECHECK', true)
            .subscribe(response => {
              if (response.status === 'COMPLETED') {
                this.buttonInfo = 'dashboard';
              } else {
                this.buttonInfo = 'diagnostics';
              }
            });
        });
      }
    });
  }
}
