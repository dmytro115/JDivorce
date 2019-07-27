import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { QuestionnaireListDialogComponent } from './components/questionnaire-list-dialog/questionnaire-list-dialog.component';

import { AnalysisComponent } from './components/analysis/analysis.component';
import { CaseInfoComponent } from './components/case-info/case-info.component';
import { DashboardAppComponent } from './components/dashboard-app/dashboard-app.component';
import { DiagnosticsComponent } from './components/diagnostics/diagnostics.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { QuestionnaireListComponent } from './components/questionnaire-list/questionnaire-list.component';
import { DashboardSharedService } from './services/dashboard-shared.service';

import { DocumentsService } from '../../core/services/court-documents/documents.service';
import { RouterTabModule } from '../../modules/router-tab/router-tab.module';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { JDQuestionnaireModule } from '../jd-questionnaire/jd-questionnaire.module';
import { DomesticViolenceAnalysisComponent } from './components/domestic-violence-analysis/domestic-violence-analysis.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    CaseInfoComponent,
    DashboardAppComponent,
    DiagnosticsComponent,
    QuestionnaireListComponent,
    DocumentsComponent,
    DomesticViolenceAnalysisComponent,
    QuestionnaireListDialogComponent
  ],
  providers: [DashboardSharedService, DocumentsService],
  imports: [CommonModule, RouterModule, RouterTabModule, JDQuestionnaireModule, SharedModule, SweetAlert2Module, TranslateModule, AngularMaterialModule],
  exports: [AnalysisComponent, CaseInfoComponent, DashboardAppComponent, DiagnosticsComponent],
  entryComponents: [QuestionnaireListDialogComponent]
})
export class DashboardModule {}
