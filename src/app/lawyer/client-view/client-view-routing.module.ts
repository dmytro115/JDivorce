import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { QuestionnaireComponent } from '../../modules/client-app/questionnaire/questionnaire.component';
import { ClientViewComponent } from './client-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: ClientViewComponent },
  { path: 'questionnaire', loadChildren: '../../modules/client-questionnaire/client-questionnaire.module#ClientQuestionnaireModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ClientViewRoutingModule {}
