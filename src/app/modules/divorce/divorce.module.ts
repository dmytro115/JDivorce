import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivorceRoutingModule } from './divorce-routing.module';
import { DivorceDashboardComponent } from './components/divorce-dashboard/divorce-dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { LimeSurveyTabComponent } from './components/lime-survey-tab/lime-survey-tab.component';
import { DivorceCaseInfoComponent } from './components/divorce-case-info/divorce-case-info.component';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { LimeSurveyGdocsDocumentsComponent } from './components/lime-survey-gdocs-documents/lime-survey-gdocs-documents.component';
import { FilingDocumentsComponent } from './components/filing-documents/filing-documents.component';
import { FinalizationComponent } from './components/finalization/finalization.component';
import { FinalizationDocumentsComponent } from './components/finalization-documents/finalization-documents.component';

@NgModule({
  declarations: [
    DivorceDashboardComponent,
    LimeSurveyTabComponent,
    DivorceCaseInfoComponent,
    LimeSurveyGdocsDocumentsComponent,
    FilingDocumentsComponent,
    FinalizationComponent,
    FinalizationDocumentsComponent
  ],
  imports: [
    CommonModule,
    DashboardModule,
    DivorceRoutingModule,
    AngularMaterialModule
  ],
  exports: [ DivorceDashboardComponent ]
})
export class DivorceModule { }
