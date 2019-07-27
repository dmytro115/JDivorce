import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmicableComponent } from './amicable/amicable.component';
import { ConflictComponent } from './conflict/conflict.component';
import { KidsVilleComponent } from './kidsvile/kidsville.component';
import { PlansOverViewComponent } from './plans-overview/plans-overview.component';
import { TenseComponent } from './tense/tense.component';

const routes: Routes = [
  { path: 'overview', component: PlansOverViewComponent },
  { path: 'amicable', component: AmicableComponent },
  { path: 'conflict', component: ConflictComponent },
  { path: 'amicable-with-children', component: KidsVilleComponent },
  { path: 'tense', component: TenseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PlansRoutingModule {}
