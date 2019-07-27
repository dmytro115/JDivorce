import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, RouterEvent } from '@angular/router';
import * as $ from 'jquery';
import { AuthService, ClientService, LawyerProfileService, SharedPlanService } from '../../core';
import { WorkflowType } from '../../core/models/workflow-type.model';
import { RouteChangeService } from '../../core/route-change/route-change.service';
import { BreadCrumb } from './bread-crumb.model';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  animations: [
    trigger('rightSidebarTrigger', [
      state('show', style({ width: '375px', display: 'block' })),
      state('hide', style({ display: 'none' })),
      transition('hide => show', animate('300ms ease-in')),
      transition('show => hide', animate('300ms ease-out'))
    ])
  ]
})
export class PageTitleComponent implements OnInit {
  breadCrumbs: Array<BreadCrumb> = [];
  limeSurveyQuestionnaire: { qid: number; token: string } = { qid: undefined, token: undefined };
  breadCrumbTitles: any = {
    dashboard: 'Dashboard',
    precheck: 'Diagnostics',
    import_tax: 'Import Data',
    process: 'Process',
    filingsurveys: 'Case Info',
    analysis: 'Analysis',
    filingdocuments: 'Download Filing Documents',
    finalizationsurveys: 'Finalization Surveys',
    finalizationdocuments: 'Download Finalization Documents',
    checkout: 'Checkout',
    conversations: 'Conversations',
    questionnaire: 'Questionnaires',
    'divorce-process': 'Divorce Process',
    'uploaded-files': 'My Files',
    taxes: 'Import Tax Data',
    profile: 'Profile Setup',
    welcome: 'PROFILE.WELCOME.TITLE',
    'display-photo': 'PROFILE.DISPLAY_PICTURE',
    profession: 'PROFILE.PROFESSION',
    contact: 'PROFILE.CONTACT.TITLE',
    experiences: 'PROFILE.EXPERIENCES',
    'practice-areas': 'PROFILE.PRACTICE_AREA',
    'recent-cases': 'PROFILE.RECENT_CASES.TITLE',
    pricing: 'PROFILE.PRICING',
    calendar: 'PROFILE.CALENDAR',
    settings: 'PROFILE.SETTING.TITLE',
    video_q_a: 'PROFILE.VIDEO_Q_A',
    preview: 'PROFILE.PREVIEW',
    orders: 'Orders',
    archives: 'Archives',
    diagnostics: 'Diagnostics',
    'case-info': 'Case Info',
    'domestic-violence': 'Domestic Violence',
    documents: 'Documents',
    divorce: 'Divorce',
    'filing-documents': 'Filing Documents',
    clients: 'Your Clients'
  };

  pageTitle = '';

  private routeChangeParams: Params;

  private readonly dashboardSources = {
    [WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT]: {
      title: 'Domestic Violence Dashboard'
    },
    [WorkflowType.DIVORCE_FRAGMENT]: {
      title: 'Divorce Dashboard'
    }
  };

  private readonly questionnaireTitles = {
    precheck: 'Diagnostics',
    protection_order: 'Protection Order',
    about_you: 'About You',
    about_the_respondent: 'About The Respondent',
    children: 'About The Children',
    domestic_violence_diagnostics: 'Diagnostics'
  };

  constructor(
    private readonly router: Router,
    public activatedRoute: ActivatedRoute,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private readonly routeChangeService: RouteChangeService,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly _sharedPlanService: SharedPlanService
  ) {
    this.subscribeToRouteChangeEvents();

    // The questionnaire component emits the matrix url params on init.
    // Subscribe to the params to handle the questionnaire title for the bread crumb.
    this.routeChangeService.params$.subscribe((params: Params) => {
      this.routeChangeParams = params;
    });
  }

  ngOnInit(): void {
    this.subscribeToRouteParams();
    this.determinePageProperties();

    this.professionalProfileService.showDefaultPlans().subscribe((plans: Array<any>) => {
      plans.forEach(plan => {
        if (plan.id === this._sharedPlanService.selectedPlanId) {
          this.pageTitle = plan.name;
        }
      });
    });
  }

  private subscribeToRouteChangeEvents(): void {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.determinePageProperties();
      }
    });
  }

  private subscribeToRouteParams(): void {
    this.activatedRoute.queryParams.subscribe(params => (this.limeSurveyQuestionnaire = { qid: parseInt(params.s, 10), token: params.t }));
  }

  private determinePageProperties(): void {
    this.breadCrumbs = [];
    let blockPush = false;
    // Example: ['a', 'c']
    const urlAppComponents = this.router.url.split('/').filter(item => item.length === 1);
    const urlParts = this.router.url.split('/').filter(item => item.length > 1);

    // TODO: Removes trailing matrix params from the last part.
    if (urlParts.length) {
      urlParts[urlParts.length - 1] = urlParts[urlParts.length - 1].split(';')[0];
    }

    for (let i = 0; i < urlParts.length; i++) {
      let urlPart = urlParts[i];
      const route: any = urlPart.split('?');
      urlPart = route.length ? route[0] : urlParts[i];

      // We will use this title and URL to build the bread crumb unless `blockPush` is true.
      let title = this.breadCrumbTitles[urlPart];
      const breadCrumbUrlParts = [urlPart];

      if (this.authService.isViewClientMode()) {
        // check for top-most breadcrumb for viewing a client as a lawyer
        // eg. 'Your Clients'
        if (this.authService.isViewClientId(urlPart)) {
          title = this.authService.getViewClientEmail();
          // This is to create the URL '/a/l/clients/abcd-efgh'
          breadCrumbUrlParts.unshift('clients');
        } else {
          // The questionnaire path of a view client
          if (urlPart === 'questionnaire') {
            blockPush = true;
            // check for questionnaire title breadcrumb for viewing a client's questionnaire as a lawyer
            // eg. Questionnaire: Diagnostics
            this.handleQuestionnaireTitle(urlPart, true, urlAppComponents);
          }
        }
      } else {
        // The questionnaire path
        if (urlPart === 'questionnaire') {
          blockPush = true;
          this.handleQuestionnaireTitle(urlPart, false, urlAppComponents);
        }

        // The checkout path
        if (urlParts.includes('checkout')) {
          blockPush = true;
          switch (urlParts[urlParts.length - 1].split('?')[0]) {
            case 'plans':
              title = 'Select a plan';
              break;
            case 'lawyers':
              title = 'Select a lawyer';
              break;
            case 'review':
              title = 'Review';
              break;
            case 'confirmation':
              title = 'Confirmation';
              break;
            default:
              break;
          }

          this.breadCrumbs = [new BreadCrumb('Hire Attorney', this.buildUrl(['checkout', 'lawyers'])), new BreadCrumb(title)];
        }
      }

      if (!blockPush) {
        this.breadCrumbs.push(new BreadCrumb(title || 'UNKNOWN', this.buildUrl(breadCrumbUrlParts)));
      }
    }
  }

  private buildUrl(urlParts: Array<string>): string {
    let userTypeFragment: string;
    if (this.authService.isClient()) {
      userTypeFragment = 'c';
    } else if (this.authService.isLawyer()) {
      userTypeFragment = 'l';
    }

    return [userTypeFragment].concat(urlParts).join('/');
  }

  private handleQuestionnaireTitle(urlPart: string, skipDashboardBreadCrumb: boolean, urlAppComponents: Array<string>): void {
    // For our own questionnaires.
    const urlFragment = this.routeChangeParams.source;
    if (urlFragment && Object.keys(this.dashboardSources).includes(urlFragment)) {
      const dashboardBreadCrumb = new BreadCrumb(this.dashboardSources[urlFragment].title, this.buildUrl([urlFragment]));
      const questionnaireBreadCrumb = new BreadCrumb(`Questionnaire: ${this.questionnaireTitles[this.routeChangeParams.qid]}`);
      this.pushQuestionnaireBreadCrumbs(dashboardBreadCrumb, questionnaireBreadCrumb, skipDashboardBreadCrumb);
    } else if (this.limeSurveyQuestionnaire.qid) {
      // For LimeSurvey questionnaires.
      this.clientService
        .getAndUpdateLs()
        .toPromise()
        .then(result => {
          const { forms } = result;
          const currentQuestionnaireKeys = Object.keys(forms);
          const currentQuestionnaireKey = currentQuestionnaireKeys.filter((key: string) => this.limeSurveyQuestionnaire.qid === forms[key].id)[0];
          const dashboardBreadCrumb = new BreadCrumb(
            this.dashboardSources[WorkflowType.DIVORCE_FRAGMENT].title,
            this.buildUrl([WorkflowType.DIVORCE_FRAGMENT])
          );
          const questionnaireBreadCrumb = new BreadCrumb(`Questionaire: ${forms[currentQuestionnaireKey].title}`);
          this.pushQuestionnaireBreadCrumbs(dashboardBreadCrumb, questionnaireBreadCrumb, skipDashboardBreadCrumb);
        });
    }
  }

  private pushQuestionnaireBreadCrumbs(dashboardBreadCrumb: BreadCrumb, questionnaireBreadCrumb: BreadCrumb, skipDashboardBreadCrumb: boolean): void {
    if (!skipDashboardBreadCrumb && dashboardBreadCrumb) {
      this.breadCrumbs.push(dashboardBreadCrumb);
    }
    if (questionnaireBreadCrumb) {
      this.breadCrumbs.push(questionnaireBreadCrumb);
    }
  }
}
