import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { AuthService, LawyerProfileService, PNotifyService, ProfessionalProfile, StripeService } from '../../../core';
import { CheckoutStoreService } from '../checkout-store.service';

import * as moment from 'moment';
import { PaypalDialogComponent } from '../paypal-dialog/paypal-dialog.component';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  package: any;
  profile: ProfessionalProfile;
  appointmentDate: any;
  payDirectlyButtonDisabled = false;
  pnotify: any;

  @ViewChild('paypalSwal') private readonly paypalSwal: SwalComponent;
  private readonly checkContactFormSource = 'payDirectly';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly stripeService: StripeService,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly checkoutStoreService: CheckoutStoreService,
    private readonly pNotifyService: PNotifyService,
    private  dialogRef: MatDialog
    
  ) {
    this.pnotify = pNotifyService.get();
  }

  ngOnInit(): void {
    this.checkoutStoreService.contactInfo$.subscribe(
      response => {
        if (response.valid && response.source === this.checkContactFormSource) {
          this._payLawyerDirectly(response.value);
        }
      }
    );

    this.route.url.subscribe((url: Array<UrlSegment>) => {
      const review = url[0]; // /a/c/checkout/review;plan=2
      const planIdParam = review.parameters.plan;
      const profileId = review.parameters.p;
      const date = review.parameters.date;
      if (planIdParam && profileId) {
        const planId = parseInt(planIdParam, 10);

        this.professionalProfileService.show(profileId).subscribe((profile: ProfessionalProfile) => {
          this.profile = profile;
          this.package = profile.info.plans.find(plan => plan.id === planId);
        });
      }

      if (date) {
        this.appointmentDate = moment(date);
      }
    });
  }

  onCheckoutFormComplete(response): void {
    this.checkoutStoreService.wizardNextStep(response);
  }

  payLawyerDirectly(): void {
    // Check if the contact information is filled out.
    this.checkoutStoreService.checkContactForm(this.checkContactFormSource);
  }

  _payLawyerDirectly(contactInfo): void {
    const { email } = this.authService.getCurrentUser();
    this.payDirectlyButtonDisabled = true;

    const startTime = this.appointmentDate;
    const selectedPlan = {
      id: this.package.id
    };

    this.stripeService
      .payDirectly(this.profile.id, this.appointmentDate, selectedPlan, contactInfo)
      .subscribe(
        (response: any) => {
          this.checkoutStoreService.wizardNextStep(response);
          this.payDirectlyButtonDisabled = false;
        },
        error => {
          if (error.status === 403) {
            this.pnotify.error({
              title: 'This email is already being used!',
              text: 'If you already have an account, please login. If not, please use a different email.'
            });
          }
          this.payDirectlyButtonDisabled = false;
        });
  }

  paypal(): void {
    setTimeout(() => {
      const alertDialog = this.dialogRef.open(PaypalDialogComponent)
      alertDialog.afterOpen().subscribe();
    });
    this.stripeService.paypal().subscribe();
  }

  formatAppointmentDateLabel(): string {
    if (this.appointmentDate) {
      return 'Your appointment date is on ';
    } else {
      return 'You have no appointment date selected';
    }
  }

  formatAppointmentDate(): string {
    if (this.appointmentDate) {
      return this.appointmentDate.format('ddd MMMM D[th], ha');
    } else {
      return '';
    }
  }
}
