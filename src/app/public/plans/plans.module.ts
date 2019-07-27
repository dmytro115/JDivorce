import { CommonModule } from '@angular/common';
import { TenseComponent } from '../..//public/plans/tense/tense.component';
import { LawyerProfileService } from '../../core';
import { AmicableComponent } from '../../public/plans/amicable/amicable.component';
import { AngularMaterialModule } from './../../modules/angular-material/angular-material.module';
import { ConflictComponent } from './conflict/conflict.component';
import { KidsVilleComponent } from './kidsvile/kidsville.component';
import { PlansOverViewComponent } from './plans-overview/plans-overview.component';
import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './plans.component';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    PlansComponent,
    PlansOverViewComponent,
    AmicableComponent,
    KidsVilleComponent,
    TenseComponent,
    ConflictComponent
  ],
  imports: [AngularMaterialModule, CommonModule, PlansRoutingModule],
  providers: [LawyerProfileService],
  exports: []
})
export class PlansModule {}
