import { NgModule } from '@angular/core';
import { ProfileService } from './profile/profile.service';

import { ConversationsModule } from '../modules/conversations/conversations.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { SharedModule } from '../shared/shared.module';

import { StripeCheckoutOrder } from './../client/orders/stripe-checkout-order.component';
import { StripeService } from './../core/stripe/stripe.service';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AppCloneComponent } from './app-clone/app-clone.component';
import { ClientInviteComponent } from './client-invite/client-invite.component';
import { ClientListComponent } from './client-list/client-list.component';
import { LawyerRoutingModule } from './lawyer-routing.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { JDQuestionnaireModule } from '../modules/jd-questionnaire/jd-questionnaire.module';

import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';

@NgModule({
  declarations: [DashboardComponent, ClientListComponent, ClientInviteComponent, AppCloneComponent],
  imports: [LawyerRoutingModule, SharedModule, NgSelectModule, ConversationsModule, OrdersModule, JDQuestionnaireModule, AngularMaterialModule],
  providers: [ProfileService, { provide: StripeCheckoutOrder, useClass: StripeCheckoutOrder, deps: [StripeService] }],
  exports: [],
  entryComponents: [ClientInviteComponent, AppCloneComponent]
})
export class LawyerModule {}
