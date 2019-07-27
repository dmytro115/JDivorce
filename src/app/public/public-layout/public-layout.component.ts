import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService, BeginDivorceApplicationService, Client } from '../../core';
import { SigninComponent } from '../../core/auth/components/signin/signin.component';

import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { ModalDialogService } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';
import { MixpanelService } from '../../core/mixpanel/mixpanel.service';

import { first } from 'rxjs/operators';
import { AuthDialogService } from '../../core/auth/auth-dialog.service';
import { RegisterComponent } from '../../core/auth/components';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {
  @ViewChild('signInForm')
  signInForm;
  @ViewChild('signUpForm')
  signUpForm;
  @ViewChild('forgotPasswordForm')
  forgotPasswordForm;

  client: Client;
  toggle = true;
  langIcon = 'flag-icon-us';
  changeHeader = false;
  hideTopNav = false;
  headerShadow = false;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly beginDivorceApplicationService: BeginDivorceApplicationService,
    private readonly authService: AuthService,
    private readonly mixpanelService: MixpanelService,
    private readonly modalService: ModalDialogService,
    private readonly authDialogService: AuthDialogService,
    private readonly viewRef: ViewContainerRef,
    private readonly spinner: NgxSpinnerService
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.toggle = true; // window.pageYOffset > 80;

    if (window.pageYOffset > 60) {
      console.log(document.getElementById('mainHeader').classList);
      document.getElementById('mainHeader').classList.add('main-nav--bg');
    } else {
      document.getElementById('mainHeader').classList.remove('main-nav--bg');
    }
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
          this.signInForm.show(this.signInForm, this.signUpForm, this.forgotPasswordForm);
        });
      }
    });
  }

  beginApplication() {
    this.spinner.show();
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

  goToDashboard() {
    if (this.authService.isLawyer()) {
      this.router.navigate(['a/l/dashboard']);
    } else {
      this.router.navigate(['a/c/dashboard']);
    }
  }

  updateLanguage(langCode): void {
    this.mixpanelService.track('Language', { langCode });
    this.langIcon = langCode === 'en' ? 'flag-icon-us' : 'flag-icon-mx';
    this.translate.use(langCode);
  }

  triggerSignin(): void {
    this.authDialogService.openSigninDialog();
  }

  triggerSignup(): void {
    this.authDialogService.openSignupDialog({ registeredFrom: this.router.url});
  }

  triggerSignout(): void {
    this.authService.logout((data: any) => {
      this.router.navigate(['/']);
    });
  }
}
