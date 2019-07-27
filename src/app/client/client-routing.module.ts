import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingOrdersComponent } from '../modules/orders/orders.component';
import { TimelineComponent } from '../shared/timeline/timeline.component';
import { ArchivesComponent } from './archives/archives.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ClientResolve } from './client.resolve';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'exact' },
  { path: 'dashboard', loadChildren: '../modules/divorce/divorce.module#DivorceModule' },
  { path: 'domestic-violence', loadChildren: '../modules/domestic-violence/domestic-violence.module#DomesticViolenceModule' },
  { path: 'divorce', loadChildren: '../modules/divorce/divorce.module#DivorceModule' },
  { path: 'questionnaire', loadChildren: '../modules/client-questionnaire/client-questionnaire.module#ClientQuestionnaireModule' },
  {
    path: 'checkout',
    children: [
      { path: '', redirectTo: 'lawyers' },
      { path: ':step', component: CheckoutComponent, resolve: { client: ClientResolve }, data: { attorney: true } }
    ]
  },
  { path: ':workflowUrlFragment/process', component: TimelineComponent },
  { path: 'uploaded-files', loadChildren: '../modules/file-manager/file-manager.module#FileManagerModule' },
  { path: 'orders', component: BillingOrdersComponent },
  { path: 'archives', component: ArchivesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ClientResolve]
})
export class ClientRoutingModule {}
