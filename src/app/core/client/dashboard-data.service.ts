import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ClientDashboardDataService {
  GENERATE_DOCUMENTS_API = "/api/client/generate_documents";
  GENERATE_DOCUMENTS_SPOUSE_API = "/api/client/generate_documents_spouse";

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) { }

  formatFormsDisplay(forms, isLawyer, user, language) {
    language = this.translate.currentLang

    for (var formName in forms) {
      var form = forms[formName];
      form.allPrevCompleted = form.all_prev_complete
      if (form.form_status === 'EDIT') {
        form.statusText = 'forms_status.complete';
        form.actionText = 'forms_action.edit';
        form.statusClass = 'text-success';
        form.actionIcon = 'fa-edit';
        form.actionUrl = this.formatActionUrl(form, formName, user, language);
      } else if (form.form_status === 'IN_PROGRESS') {
        form.statusText = 'forms_status.in_progress';
        form.actionText = 'forms_action.edit';
        form.statusClass = 'text-warning';
        form.actionIcon = 'fa-edit';
        form.actionUrl = this.formatActionUrl(form, formName, user, language);
      } else {
        form.statusText = 'forms_status.not_started';
        form.actionText = 'forms_action.begin';
        form.statusClass = 'text-info';
        form.actionIcon = 'fa-list';
        /*formCompleted = false;*/
        form.actionUrl = this.formatActionUrl(form, formName, user, language);
      }
      if (isLawyer) {
        form.actionText = 'forms_action.view';
      }
      //console.log('Form [' + formName + '] status is: ' + form.statusText);
    }
  };

  formatDocumentsDisplay(documents) {
    for (var title in documents) {
      var doc = documents[title];
      var date = new Date(doc.updated);
      doc.lastUpdatedFormatted = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      doc.pdfURL = doc.url.replace('/edit?usp=drivesdk', '/export?format=pdf');
      doc.docURL = doc.url.replace('/edit?usp=drivesdk', '/export?format=doc');
    }
  };

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

  generateDocuments(isPleading: boolean) {
    return this.http.post(this.GENERATE_DOCUMENTS_API, { is_pleading: isPleading }, httpOptions);
  }

  generateDocumentsSpouse() {
    return this.http.post(this.GENERATE_DOCUMENTS_SPOUSE_API, null, httpOptions);
  }
}
