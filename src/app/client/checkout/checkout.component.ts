import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { WizardComponent } from "angular-archwizard";
import { TranslateService } from "@ngx-translate/core";
import * as dayjs from 'dayjs';

import { MixpanelService } from "../../core/mixpanel/mixpanel.service";
import { LawyerProfileService } from '../../core/lawyer/lawyer-profile.service';
import { ProfessionalProfile } from '../../core/lawyer/professional-profile.interface'; 
import { CheckoutStoreService } from './checkout-store.service';

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
  @ViewChild("checkoutWizard")
  private wizard: WizardComponent;

  _dayjs = dayjs;

  defaultStepIndex: number;
  step: any;
  params = {};
  steps: any = {
    lawyers: 0,
    review: 1,
    confirmation: 2
  };
  wizardDone = false;

  profile: ProfessionalProfile;
  plan;
  appointmentDate;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private profileService: LawyerProfileService,
    private checkoutStoreService: CheckoutStoreService,
    private mixpanelService: MixpanelService
  ) {
    // The review component will publish the event when the form submission succeeds.
    this.checkoutStoreService.wizardNextStep$.subscribe(
      order => {
        this.router.navigate(['/a/c/checkout/confirmation', { o: order.id }]);
        // this.wizard.model.navigationMode.goToNextStep();
      });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });

    this.route.params.subscribe(params => {
      this.step = params.step;

      if (typeof this.steps[params.step] !== "undefined") {
        if (params.step === "review" && typeof params["p"] === "undefined") {
          this.router.navigate(["/a/c/checkout/lawyers"]);
        } else {
          if (params.step === "review") {
          }
          this.defaultStepIndex = this.steps[params.step];
          setTimeout(() => {
            this.wizard.navigation.goToStep(this.steps[params.step]);
          }, 50);
        }
      } else {
        this.router.navigate(["/a/c/checkout/lawyers"]);
      }
    });
  }

  onSelectProfile(data) {
    this.router.navigate(['/a/c/checkout/review', data.params]);
  }

  canEnter(step) {
    if (this.step === "confirmation") {
      setTimeout(() => {
        this.wizardDone = true;
      }, 1000);
      return false;
    }
    return true;
  }

  onEnterStep(step) {
    if (this.step !== step) {
      let params = {};
      if (step === "lawyers") {
        params = {};

        $(window).trigger('resize');

      } else if (step === "review") {
        params = {
          lawyer: this.params["lawyer"]
        };
      }
      this.router.navigate([`/a/c/checkout/${step}`], {
        queryParams: params
      });
    }
  }
}
