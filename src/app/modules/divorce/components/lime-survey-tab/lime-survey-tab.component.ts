import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardTabComponent } from '../../../dashboard/components/dashboard-tab/dashboard-tab.component';
import { AuthService, ClientService, MixpanelService } from '../../../../core';

import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

@Component({
  selector: 'app-lime-survey-tab',
  templateUrl: './lime-survey-tab.component.html',
  styleUrls: ['./lime-survey-tab.component.scss'],
  animations: [
    trigger('tableTransition', [transition('* => *', useAnimation(fadeIn, {
      params: { timing: 0.5 }
    }))])
  ]
})
export class LimeSurveyTabComponent extends DashboardTabComponent implements OnInit {
  @Input() questionnaires;
  @Input() user;
  headerColumns = ['title', 'status', 'action'];

  constructor(private router: Router, protected clientService: ClientService, protected mixpanelService: MixpanelService) {
    super(mixpanelService);
  }

  onInit() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.user = data;
        const firstStage = data.forms_list_first_stage;
        const keys = Object.keys(firstStage);
        keys.forEach(id => { this.questionnaires.push(firstStage[id]); });
      },
      error => {
        console.log(error);
      }
    );
  }

  formStatusColor(questionnaire) {
    if (questionnaire.form_status === 'EDIT') {
      return 'primary';
    } else if (questionnaire.form_status === 'IN_PROGRESS') {
      return 'accent';
    } else {
      return 'basic';
    }
  }

  formStatusText(questionnaire) {
    if (questionnaire.form_status === 'EDIT') {
      return 'Complete';
    } else if (questionnaire.form_status === 'IN_PROGRESS') {
      return 'In Progress';
    } else {
      return 'Not Started';
    }
  }

  formActionText(questionnaire) {
    if (questionnaire.form_status === 'EDIT') {
      return 'Edit';
    } else if (questionnaire.form_status === 'IN_PROGRESS') {
      return 'Edit';
    } else {
      return 'Begin';
    }
  }

  actionButtonColor(questionnaire) {
    if (questionnaire.form_status === 'EDIT') {
      return 'basic';
    } else if (questionnaire.form_status === 'IN_PROGRESS') {
      return 'accent';
    } else {
      return 'primary';
    }
  }

  onActionClick(questionnaire) {
    const params = this.buildQuestionnaireParams(this.formatActionUrl(questionnaire, questionnaire.name, this.user, 'en'));
    if (questionnaire.form_status === 'START') {
      this.clientService.saveFormEditStatus(questionnaire.name, 'IN_PROGRESS').subscribe((data: any) => {
        this.router.navigate(['a/c/questionnaire'], { queryParams: params });
      });
    } else {
      this.router.navigate(['a/c/questionnaire'], { queryParams: params });
    }
  }

  disableActionButton(index) {
    if (index === 0) return false;
    return this.questionnaires[index - 1].form_status !== 'EDIT';
  }

  buildQuestionnaireParams(url: string) {
    let paramsMap = {}
    let params = url.substr(url.indexOf('?') + 1).split('&');
    for (let p of params) {
      let args = p.split('=');
      let key = args[0];
      let val = args[1];
      paramsMap[key] = val;
    }
    return paramsMap;
  }

  formatActionUrl(form, formName, user, language) {
    // let url = '/questionnaires#!?s=' + parseInt(form.id) + '&t=' + form.token + '&lang=' + language;
    let url = 'a/c/questionnaire/?s=' + parseInt(form.id) + '&t=' + form.token + '&lang=' + language;
    if (formName == 'PRECHECK' && user.email != undefined) {
      url += '&email=' + user.email;
    }

    if (formName == 'YOU_AND_YOUR_SPOUSE') {
      url += '&signedADivorce=' + user.havePrenup;
      url += '&zip=' + user.zip;
    }

    if (formName == 'SPOUSE_RESPONSE') {
      url += '&isFilingJointlyFin=' + user.fileJointly;
    }

    if (formName == 'FINANCIALS') {
      url += '&havePrenup=' + user.havePrenup;
      url += '&fileJointly=' + user.fileJointly;
    }

    if (formName == 'SPOUSAL_SUPPORT') {
      url += '&dateOfMarriage=' + user.dateOfMarriage;

      if (user.tempOrderParentPlan == 'Y' || user.tempOrderParentPlan == 'N') {
        url += '&tempOrderParentPlan=' + user.tempOrderParentPlan;
      }

      if (user.tempOrderChildSup == 'Y' || user.tempOrderChildSup == 'N') {
        url += '&tempOrderChildSup=' + user.tempOrderChildSup;
      }

      if (user.tempOrderSpSup == 'Y' || user.tempOrderSpSup == 'N') {
        url += '&tempOrderSpSup=' + user.tempOrderSpSup;
      }
    }

    if (formName == 'CHILDREN') {
      url += '&isLivingTogether=' + user.isLivingTogether;
    }

    if (formName == 'CHILDREN_RIGHTS_CASES') {
      url += '&legalRightSpendTime=' + user.legalRightSpendTime;
      url += '&courtCasesInvolving=' + user.courtCasesInvolving;
    }

    if (formName == 'CHILD_SUPPORT') {
      url += '&parentingPlan=' + user.parentingPlan;
      url += '&childrenInWashington=' + user.childrenInWashington;
      url += '&anotherHomeState=' + user.anotherHomeState;

      if (user.tempOrderChildSup == 'Y' || user.tempOrderChildSup == 'N') {
        url += '&tempOrderChildSup=' + user.tempOrderChildSup;
      }
    }

    if (formName == 'TEMPORARY_ORDERS') {
      if (user.tempOrderChildSup == 'Y' || user.tempOrderChildSup == 'N') {
        url += '&tempOrderChildSup=' + user.tempOrderChildSup;
      }

      if (user.isSpouseMilitary == 'Y') {
        url += '&isSpouseMilitary=' + user.isSpouseMilitary;
      }
    }

    if (formName == 'CHILDREN_FROM_RELATIONSHIPS') {
      url += '&childrnFrmOthrReltan=' + user.childrnFrmOthrReltan;
      url += '&sposeOthrRelatnChild=' + user.sposeOthrRelatnChild;
    }

    if (formName == 'PP_SCHEDULE') {
      url += '&isLimitationsParents=' + user.isLimitationsParents;
      url += '&hasChildUnderSchoolAge=' + user.hasChildUnderSchoolAge;
      url += '&tempOrderParentPlan=' + user.tempOrderParentPlan;
    }

    if (formName == 'PP_LIMITATIONS') {
      url += '&tempOrderParentPlan=' + user.tempOrderParentPlan;
    }

    if (formName == 'PP_HOLIDAYS') {
      url += '&tempOrderParentPlan=' + user.tempOrderParentPlan;
    }

    if (formName == 'VITAL_STATISTICS') {
      url += '&signedADivorce=' + user.havePrenup;
      url += '&zip=' + user.zip;
      url += '&isLivingTogether=' + user.isLivingTogether;
    }

    return url;
  }
}

// all_prev_complete: false
// description: null
// form_status: "START"
// id: 279521
// name: "CHILDREN_FROM_RELATIONSHIPS"
// title: "Children From Other Relationships"
// token: "GJKj_j2Q51F3-CgAHd-N8w"
// url: "https://forms-test.jdivorce.com/index.php/279521?token=GJKj_j2Q51F3-CgAHd-N8w"
