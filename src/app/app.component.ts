import { Component, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AuthService } from './core/auth/auth.service';
import { MixpanelService } from './core/mixpanel/mixpanel.service';
import { CustomHtmlModalService } from './shared/custom-html-modal/custom-html-modal.service';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalDialogService } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0.25 }), animate(300)]),
      transition('* => void', [animate(200, style({ opacity: 0.25 }))])
  ])]
})

export class AppComponent {
  title = 'app';
  @ViewChild('signInForm')
  signInForm;
  @ViewChild('signUpForm')
  signUpForm;
  @ViewChild('forgotPasswordForm')
  forgotPasswordForm;
  showModal;
  block;

  constructor(
    private readonly viewRef: ViewContainerRef,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly mixpanelSerivce: MixpanelService,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private readonly route: ActivatedRoute,
    private readonly modalService: CustomHtmlModalService,
    private readonly renderer: Renderer2,
    private readonly modalDialogService: ModalDialogService,
    private readonly authService: AuthService
  ) {
    this.translate.use('en');
  }

  ngAfterViewInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.authService.isUserAuthenticated$.next(false);
    } else {
      this.authService.isUserAuthenticated$.next(true);
    }
  }

  ngOnInit(): void {
    this.mixpanelSerivce.init();
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {

        return;
      } else if (evt instanceof NavigationEnd) {
      }
      window.scrollTo(0, 0);
    });

    this.modalService.MODAL_STREAM$.subscribe(status => {
     if (status) {
       this.showModal = true;
       this.block = status;
     } else {
      this.showModal = false;
     }
    });
  }
}
