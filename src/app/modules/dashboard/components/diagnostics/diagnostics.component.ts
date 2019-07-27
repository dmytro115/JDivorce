import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthService, MixpanelService } from '../../../../core';
import { WorkflowType } from '../../../../core/models/workflow-type.model';
import { QuestionnaireService } from '../../../jd-questionnaire/jd-questionnaire.service';
import { DashboardSharedService } from '../../services/dashboard-shared.service';
import { SpinnerService } from '../../services/spinner.service';
import { DashboardTabComponent } from '../dashboard-tab/dashboard-tab.component';
import { QuestionnaireListDialogComponent } from '../questionnaire-list-dialog/questionnaire-list-dialog.component';

@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent extends DashboardTabComponent implements OnInit {
  questionnaires: Array<any>;

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly authService: AuthService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly dashboardSharedService: DashboardSharedService,
    public dialog: MatDialog,
    mixpanelService: MixpanelService
  ) {
    super(mixpanelService);
  }

  onInit(): void {
    this.spinnerService.isLoading({ isLoading: true, isLoadingText: 'Evaluating your current status...' });

    this.questionnaireService.show(this.authService.getClientId(), this.dashboardSharedService.workflowType, 'diagnostics').subscribe((response: any) => {
      this.spinnerService.isLoading({ isLoading: false, isLoadingText: '' });
      this.questionnaires = response;
    });
  }

  showPreambleButton(): boolean {
    return this.dashboardSharedService.urlFragment === WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT;
  }

  showPreamble(): void {
    const dialogRef = this.dialog.open(QuestionnaireListDialogComponent, {
      width: '700px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe();
  }
}
