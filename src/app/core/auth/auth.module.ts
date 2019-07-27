import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthDialogService } from './auth-dialog.service';
import { AuthRoutingModule } from './auth-routing.module';
import * as fromComponents from './components';
import * as fromContainers from './containers';

const containers = [
  fromContainers.StagingComponent,
  fromContainers.AuthLandingComponent
];

const components = [
  fromComponents.RegisterComponent,
  fromComponents.SigninComponent,
  fromComponents.ForgetPassComponent,
  fromComponents.ResetPasswordComponent,
  fromComponents.VerifyComponent
];

const entryComponents = [
  fromComponents.SigninDialogComponent,
  fromComponents.RegisterDialogComponent,
  fromComponents.ForgetPassDialogComponent
];

@NgModule({
  imports: [CommonModule, AngularMaterialModule, AuthRoutingModule , FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [...containers, ...components, ...entryComponents],
  entryComponents: [...entryComponents],
  exports: [...components],
  providers: [AuthDialogService]
})
export class AuthModule {}
