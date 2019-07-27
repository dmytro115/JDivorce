import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ArchwizardModule } from 'angular-archwizard';
import { SlickModule } from 'ngx-slick';
import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { ConversationsModule } from '../modules/conversations/conversations.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { DivorceModule } from '../modules/divorce/divorce.module';
import { DomesticViolenceModule } from '../modules/domestic-violence/domestic-violence.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { SharedModule } from '../shared/shared.module';
import { StripeService } from './../core/stripe/stripe.service';
import { ArchivesComponent } from './archives/archives.component';
import { CaseViewComponent } from './case-view/case-view.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { CheckoutStoreService } from './checkout/checkout-store.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './checkout/confirmation/confirmation.component';
import { ContactFormComponent } from './checkout/contact-form/contact-form.component';
import { PaypalDialogComponent } from './checkout/paypal-dialog/paypal-dialog.component';
import { ReviewComponent } from './checkout/review/review.component';
import { ClientRoutingModule } from './client-routing.module';
import { StripeCheckoutOrder } from './orders/stripe-checkout-order.component';

@NgModule({
  declarations: [
    ArchivesComponent,
    CaseViewComponent,
    CheckoutComponent,
    CheckoutFormComponent,
    ReviewComponent,
    ContactFormComponent,
    ConfirmationComponent,
    PaypalDialogComponent
  ],
  imports: [
    ArchwizardModule,
    ClientRoutingModule,
    DashboardModule,
    DomesticViolenceModule,
    DivorceModule,
    OrdersModule,
    TranslateModule,
    SharedModule,
    NgSelectModule,
    ConversationsModule,
    AngularMaterialModule,
    SlickModule.forRoot()
  ],
  providers: [CheckoutStoreService, { provide: StripeCheckoutOrder, useClass: StripeCheckoutOrder, deps: [StripeService] }],
  exports: [],
  entryComponents: [PaypalDialogComponent]
})
export class ClientModule {}
