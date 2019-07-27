import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingOrdersComponent } from '../modules/orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', redirectTo: 'clients' },
  { path: 'clients', component: DashboardComponent },
  { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'clients/:id', loadChildren: './client-view/client-view.module#ClientViewModule' },
  { path: 'orders', component: BillingOrdersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LawyerRoutingModule {}
