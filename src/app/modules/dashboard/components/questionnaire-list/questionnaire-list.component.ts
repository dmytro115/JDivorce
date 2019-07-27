import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { MixpanelService } from '../../../../core/mixpanel/mixpanel.service';
import { QuestionnaireService } from '../../../jd-questionnaire/jd-questionnaire.service';
import { DashboardSharedService } from '../../services/dashboard-shared.service';

@Component({
  selector: 'app-questionnaire-list',
  templateUrl: './questionnaire-list.component.html',
  styleUrls: ['./questionnaire-list.component.scss']
})
export class QuestionnaireListComponent {
  @Input() questionnaires: Array<any>;
  headerColumns = ['title', 'status', 'action'];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly dashboardSharedService: DashboardSharedService,
    private readonly mixpanel: MixpanelService
  ) {}

  formStatusColor(questionnaire) {
    switch (questionnaire.status) {
      case 'COMPLETED': {
        return 'primary';
      }
      case 'IN_PROGRESS': {
        return 'accent';
      }
      case 'NOT_STARTED': {
        return 'basic';
      }
      default: {
        return 'basic';
      }
    }
  }

  statusText(questionnaire) {
    switch (questionnaire.status) {
      case 'COMPLETED': {
        return 'forms_status.complete';
      }
      case 'IN_PROGRESS': {
        return 'forms_status.in_progress';
      }
      case 'NOT_STARTED': {
        return 'forms_status.not_started';
      }
      default: {
        return 'forms_status.not_started';
      }
    }
  }

  actionButtonColor(questionnaire) {
    switch (questionnaire.status) {
      case 'COMPLETED': {
        return 'basic';
      }
      case 'IN_PROGRESS': {
        return 'accent';
      }
      case 'NOT_STARTED': {
        return 'primary';
      }
      default: {
        return 'basic';
      }
    }
  }

  actionText(questionnaire) {
    switch (questionnaire.status) {
      case 'COMPLETED': {
        return 'forms_action.edit';
      }
      case 'IN_PROGRESS': {
        return 'forms_action.edit';
      }
      case 'NOT_STARTED': {
        return 'forms_action.begin';
      }
      default: {
        return 'forms_action.begin';
      }
    }
  }

  disableActionButton(index) {
    if (index === 0) {
      return false;
    }
    return this.questionnaires[index - 1].status !== 'COMPLETED';
  }

  navigateToQuestionnaire(name) {
    this.mixpanel.track('Questionnaire: ' + name);
    this.setQuestionnaireEditStatus(name);
  }

  setQuestionnaireEditStatus(name) {
    this.questionnaireService.edit(this.authService.getViewClientId(), name).subscribe((data: any) => {
      this.router.navigate(['a/c/questionnaire', { qid: name.toLowerCase(), source: this.dashboardSharedService.urlFragment }]);
    });
  }
}
