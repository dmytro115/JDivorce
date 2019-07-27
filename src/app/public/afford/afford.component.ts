import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { SigninComponent } from './../../core/auth/components/signin/signin.component';

import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthDialogService, AuthService, BeginDivorceApplicationService, Client } from "../../core";
import { ClientService } from "./../../core/client/client.service";

import { CustomHtmlModalService } from '../../shared/custom-html-modal/custom-html-modal.service';
import { MiniDiagnosticComponent } from '../../shared/components/mini-diagnostic/mini-diagnostic.component';
import { QuestionnaireService } from '../../modules/jd-questionnaire/jd-questionnaire.service';
import { Notification, NotificationService } from '../../core';

import { TranslateService } from '@ngx-translate/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';
import { RegisterComponent } from 'src/app/core/auth/components';
import { environment } from '../../../environments/environment';
import { LawyerProfileService } from '../../core/lawyer/lawyer-profile.service';
import { MixpanelService } from '../../core/mixpanel/mixpanel.service';
import { SharedPlanService } from '../../core/services/shared-plan.service';

@Component({
  selector: 'app-afford',
  templateUrl: './afford.component.html',
  styleUrls: [
    // './font-awesome.min.css',
    '../public-layout/public-layout.component.scss',
    './afford.component.scss'
    // '../../../assets/afford/css/bootstrap.min.css',
    // '../../../assets/afford/css/animate.css',
    // '../../../assets/afford/css/styles.css',
    // '../../../assets/afford/css/queries.css'
  ]
})
export class AffordComponent implements OnInit {
  changeHeader = false;
  hideTopNav = false;
  langIcon = 'flag-icon-us';
  client: Client;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false
  };
  @ViewChild('howItWorks') howItWorks: ElementRef;
  profiles: Array<any>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly beginDivorceApplicationService: BeginDivorceApplicationService,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly renderer: Renderer2,
    private readonly modalService: CustomHtmlModalService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly notificationService: NotificationService,
    private ModalDialogService: ModalDialogService,
    private readonly viewRef: ViewContainerRef,
    private readonly mixpanelService: MixpanelService,
    private readonly translate: TranslateService,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly _sharedPlanService: SharedPlanService,
    private readonly authDialogService: AuthDialogService
  ) {}

  profileUrl(url) {
    return url || environment.localUrl + '/assets/images/profile/default-lawyer.svg';
  }

  goToDashboard() {
    if (this.authService.isLawyer()) {
      this.router.navigate(['a/l/dashboard']);
    } else {
      this.router.navigate(['a/c/dashboard']);
    }
  }

  beginApplication() {
    this.beginDivorceApplicationService.beginApplication('navbar').subscribe(
      (client: Client) => {
        this.client = client;
      },
      error => console.log(error),
      () => {
        this.goToDashboard();
      }
    );
  }
  updateLanguage(langCode) {
    this.mixpanelService.track('Language', { langCode });
    this.langIcon = langCode === 'en' ? 'flag-icon-us' : 'flag-icon-mx';
    this.translate.use(langCode);
  }

  ngOnInit() {
    this.changeHeader = true;

    if (['/', '/a', '/?signin=true'].indexOf(this.router.url) == -1) {
      this.changeHeader = false;
    }

    if (this.router.url == '/lawyers-home') {
      this.hideTopNav = true;
    }

    this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        if (res.url == '/') {
          this.changeHeader = true;
        } else {
          this.changeHeader = false;
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params.signin == 'true') {
        setTimeout(() => {
          this.triggerSignin();
        });
      }
    });

    this.professionalProfileService.listPublic(3).subscribe((profiles: Array<any>) => {
      this.profiles = profiles;
    });

    // Listen to click events in the component
    this.renderer.listen(document.body, 'touchmove', event => {
      event.preventDefault();
    });

    const element = document.querySelector('html');
    element.classList.add('afford');

    /* When user clicks the Icon */
    $('.nav-toggle').click(function() {
      $(this).toggleClass('active');
      $('.overlay-boxify').toggleClass('open');
    });

    /* When user clicks a link */
    $('.overlay ul li a').click(function() {
      $('.nav-toggle').toggleClass('active');
      $('.overlay-boxify').toggleClass('open');
    });

    /* When user clicks outside */
    $('.overlay').click(function() {
      $('.nav-toggle').toggleClass('active');
      $('.overlay-boxify').toggleClass('open');
    });
  }

  triggerSignin(): void {
    this.authDialogService.openSigninDialog();
  }

  triggerSignup(): void {
    this.authDialogService.openSignupDialog();
  }

  onDiagnosticData(data) {
    this.beginApplicationAction(false, true, {
      zip: data.zip,
      have_dependents: data.isChildren.toString(),
      agree_divide: data.isAgreeOnSplit.toString(),
      agree_divide_custody: data.isAgreeOnCustody.toString()
    });
  }

  getStartedViaPlan(planId: number) {
    this._sharedPlanService.setPlanId(planId);
    this.beginApplicationAction(true);
  }

  beginApplicationAction(
    goToDashboard = false,
    goToDiagnostics = false,
    data: any = null
  ) {
    this.beginDivorceApplicationService.beginApplication('landing').subscribe(
      (client: Client) => {
        this.client = client;

        if (goToDashboard) {
          this.router.navigate(['/a/c/dashboard']);
        } else if (goToDiagnostics) {
          this.questionnaireService
            .updateResponse(client.id, 'PRECHECK', data)
            .subscribe((questionnaire: any) => {
              this.router.navigate(['/a/c/questionnaire/precheck'], { queryParams: { diagnostics: true } });
            });
        } else {
          this.goToCheckoutPage();
        }
      },
      error => console.log(error)
    );
  }

  scrollDown() {
    this.howItWorks.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  }

  goToCheckoutPage() {
    this.router.navigate(['a/c/checkout']);
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'disable-scroll');
    const element = document.querySelector('html');
    element.classList.remove('afford');
  }

  openModal(block) {
    this.renderer.addClass(document.body, 'disable-scroll');
    this.modalService.show(block);
  }
}
