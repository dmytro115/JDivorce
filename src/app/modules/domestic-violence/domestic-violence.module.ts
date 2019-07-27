import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomesticViolenceRoutingModule } from './domestic-violence-routing.module';
import { DomesticViolenceDashboardComponent } from './components/domestic-violence-dashboard/domestic-violence-dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  declarations: [
    DomesticViolenceDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardModule,
    DomesticViolenceRoutingModule
  ],
  exports: [ DomesticViolenceDashboardComponent ]
})
export class DomesticViolenceModule { }
