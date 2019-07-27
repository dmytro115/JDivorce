import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { SharedModule } from '../../shared/shared.module';
import { JDQuestionnaireModule } from '../jd-questionnaire/jd-questionnaire.module';
import { ClientQuestionnaireRoutingModule } from './client-questionnaire-routing.module';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { QuestionnaireListDialogComponent } from './../dashboard/components/questionnaire-list-dialog/questionnaire-list-dialog.component';

@NgModule({
  declarations: [QuestionnaireComponent],
  imports: [CommonModule, AngularMaterialModule, JDQuestionnaireModule, SharedModule, ClientQuestionnaireRoutingModule, DashboardModule],
  exports: [QuestionnaireComponent],
  entryComponents: [QuestionnaireListDialogComponent]
})
export class ClientQuestionnaireModule {}
