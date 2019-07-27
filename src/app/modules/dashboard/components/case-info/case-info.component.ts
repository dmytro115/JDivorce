import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../core/auth/auth.service';
import { MixpanelService } from '../../../../core/mixpanel/mixpanel.service';
import { QuestionnaireService } from '../../../jd-questionnaire/jd-questionnaire.service';
import { DashboardSharedService } from '../../services/dashboard-shared.service';
import { SpinnerService } from '../../services/spinner.service';
import { DashboardTabComponent } from '../dashboard-tab/dashboard-tab.component';

@Component({
  selector: 'app-case-info',
  templateUrl: './case-info.component.html',
  styleUrls: ['./case-info.component.scss']
})
export class CaseInfoComponent extends DashboardTabComponent implements OnInit {
  questionnaires: Array<any>;
  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly authService: AuthService,
    mixpanelService: MixpanelService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly dashboardSharedService: DashboardSharedService
  ) {
    super(mixpanelService);
  }

  onInit(): void {
    this.getCases();
  }

  getCases(): void {
    this.spinnerService.isLoading({ isLoading: true, isLoadingText: 'Fetching your court documents...' });
    this.questionnaireService.fetchAll(this.authService.getViewClientId(), this.dashboardSharedService.urlFragment).subscribe(
      response => {
        this.spinnerService.isLoading({ isLoading: false, isLoadingText: '' });
        this.questionnaires = response;
      },
      // tslint:disable-next-line: no-empty
      err => {}
    );
  }
}
