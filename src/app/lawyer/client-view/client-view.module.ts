import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { ClientViewRoutingModule } from './client-view-routing.module';
import { ClientViewComponent } from './client-view.component';
import { ClientDivorceComponent } from './components/client-divorce/client-divorce.component';
import { ClientDomesticViolenceComponent } from './components/client-domestic-violence/client-domestic-violence.component';

@NgModule({
  declarations: [ClientViewComponent, ClientDivorceComponent, ClientDomesticViolenceComponent],
  imports: [CommonModule, AngularMaterialModule, ClientViewRoutingModule, SharedModule]
})
export class ClientViewModule {}
