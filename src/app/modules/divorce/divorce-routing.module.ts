import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisComponent } from '../dashboard/components/analysis/analysis.component';
import { DiagnosticsComponent } from '../dashboard/components/diagnostics/diagnostics.component';
import { DivorceCaseInfoComponent } from './components/divorce-case-info/divorce-case-info.component';
import { DivorceDashboardComponent } from './components/divorce-dashboard/divorce-dashboard.component';
import { FilingDocumentsComponent } from './components/filing-documents/filing-documents.component';
import { FinalizationDocumentsComponent } from './components/finalization-documents/finalization-documents.component';
import { FinalizationComponent } from './components/finalization/finalization.component';

const routes: Routes = [
  {
    path: '',
    component: DivorceDashboardComponent,
    children: [
      { path: 'diagnostics', component: DiagnosticsComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'case-info', component: DivorceCaseInfoComponent },
      { path: 'filing-documents', component: FilingDocumentsComponent },
      { path: 'finalization', component: FinalizationComponent },
      { path: 'finlization-documents', component: FinalizationDocumentsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivorceRoutingModule {}
