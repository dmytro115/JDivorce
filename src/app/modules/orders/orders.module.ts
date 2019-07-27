import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { BillingOrdersComponent } from './orders.component';

@NgModule({
  declarations: [
    BillingOrdersComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [ BillingOrdersComponent ]
})
export class OrdersModule { }
