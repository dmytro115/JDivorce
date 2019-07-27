import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmicableComponent } from '../public/plans/amicable/amicable.component';

const routes: Routes = [{ path: 'plans', component: AmicableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
