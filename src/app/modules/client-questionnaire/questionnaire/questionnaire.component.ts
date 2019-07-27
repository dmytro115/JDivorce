import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { WorkflowType } from '../../..//core/models/workflow-type.model';
import { AuthService } from '../../../core/auth/auth.service';
import { RouteChangeService } from '../../../core/route-change/route-change.service';
import { QuestionnaireService } from '../../jd-questionnaire/jd-questionnaire.service';
import { QuestionnaireListDialogComponent } from './../../dashboard/components/questionnaire-list-dialog/questionnaire-list-dialog.component';

@Component({
  selector: 'app-client-dashboard-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  isCompleted = false;
  isLoading = false;
  isFailed = false;
  qid: any;
  status: string;
  questions: Array<any> = [];
  continueButtonUrl: string;
  questionnaireView: string;

  formId: string;
  token: string;
  lang: string;
  url: any;
  diagnostics: string;
  miniDiagnosticsResponse: any;
  source: string;

  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
    private readonly questionnaireService: QuestionnaireService,
    private readonly authService: AuthService,
    private readonly routeChangeService: RouteChangeService,
    private readonly location: Location,
    public dialog: MatDialog
  ) {
    // Emit the params to the RouteChangeService so that PageTitleComponent can pick them up and update the breadcrumb.
    this.activatedRoute.params.subscribe((params: Params) => {
      this.questionnaireView = params.view || 'verbose';
      this.routeChangeService.emitParams(params);
    });
    this.continueButtonUrl = '/a/c/dashboard';
  }

  ngOnInit(): void {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.formId = params['s'];
      this.token = params['t'];
      let urlStr = `${environment.formsUrl}/index.php/${this.formId}?token=${this.token}`;
      for (const key in params) {
        if (key !== 's' && key !== 't') {
          urlStr = urlStr.concat(`&${key}=${params[key]}`);
        }
      }
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(urlStr);
    });

    $('.iframe-full-height').on('load', function() {
      this.style.height = '0';
      this.style.height = '70vh';
    });

    $('.page-titles').css({ display: 'none' });

    this.activatedRoute.params.subscribe(params => {
      if (params['qid']) {
        this.questionnaireService.retrieve(this.authService.getViewClientId(), params['qid'].toUpperCase()).subscribe(data => {
          this.qid = params['qid'].toUpperCase();
          this.diagnostics = params['diagnostics'];
          const { status, definition, response } = data;
          if (this.diagnostics === 'true') {
            this.miniDiagnosticsResponse = response;
          }
          this.questions = definition.questions;
          this.status = status;
          if (params['source']) {
            if (params['source'] === WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT && this.qid === 'DOMESTIC_VIOLENCE_DIAGNOSTICS') {
              if (Object.entries(response).length === 0) {
                this.showInfoDialog();
              }
            }
          }
        });
      }
      this.source = params['source'];
      if (this.source === 'domestic-violence') {
        this.continueButtonUrl = '/a/c/domestic-violence';
      }
    });
  }

  onSubmit(result: any): void {
    this.isLoading = true;
    this.questionnaireService.submit(this.authService.getViewClientId(), this.qid, result).subscribe(response => {
      this.isLoading = false;
      if (response) {
        this.isCompleted = true;
      } else {
        this.isFailed = true;
      }

      if (this.questionnaireView === 'compact') {
        this.location.back();
      } else {
        this.router.navigate([this.continueButtonUrl, { submit: true, source: this.source }]);
      }
    });
  }

  getMiniDiagnosticsInfo(): string {
    const { zip, have_dependents, agree_divide, agree_divide_custody } = this.miniDiagnosticsResponse;
    let decendentsVerb = '';
    let assetsVerb = 'agree';
    let custodyverb = 'agree';
    if (have_dependents !== 'true') {
      decendentsVerb = 'not';
    }
    if (agree_divide !== 'true') {
      assetsVerb = 'disagree';
    }
    if (agree_divide_custody !== 'true') {
      custodyverb = 'disagree';
    }
    const info = `As you will see below, we have already noted that you're in zip code ${zip}, do ${decendentsVerb}
    have children and ${assetsVerb} on asset division, and ${custodyverb} on child custody or child support.`;

    return info;
  }

  ngOnDestroy(): void {
    $('body').css({ 'overflow-y': 'auto' });
    $('.page-titles').css({ display: 'flex' });
  }

  showInfoDialog(): void {
    const dialogRef = this.dialog.open(QuestionnaireListDialogComponent, {
      width: '700px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe();
  }

  // tslint:disable-next-line: no-empty
  iframeLoaded(): void {}
}
