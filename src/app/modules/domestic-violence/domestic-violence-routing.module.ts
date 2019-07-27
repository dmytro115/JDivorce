import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DomesticViolenceDashboardComponent } from './components/domestic-violence-dashboard/domestic-violence-dashboard.component';
import { DiagnosticsComponent } from '../dashboard/components/diagnostics/diagnostics.component';
import { AnalysisComponent } from '../dashboard/components/analysis/analysis.component';
import { CaseInfoComponent } from '../dashboard/components/case-info/case-info.component';
import { DocumentsComponent } from '../dashboard/components/documents/documents.component';

const routes: Routes = [
  {
    path: '',
    component: DomesticViolenceDashboardComponent,
    children: [
      { path: 'diagnostics', component: DiagnosticsComponent },
      { path: 'case-info', component: CaseInfoComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'documents', component: DocumentsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomesticViolenceRoutingModule { }
