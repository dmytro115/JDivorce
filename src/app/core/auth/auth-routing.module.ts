import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as fromContainers from './containers';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.StagingComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: ':authType', component: fromContainers.AuthLandingComponent },
      { path: ':authType/:digest', component: fromContainers.AuthLandingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
