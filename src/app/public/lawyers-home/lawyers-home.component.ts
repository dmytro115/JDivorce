import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalDialogService } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthDialogService } from '../..//core/auth';
import { AuthService } from '../../core/auth/auth.service';
import { ScrollToTop } from '../scroll-to-top';
import { SigninComponent } from './../../core/auth/components/signin/signin.component';

@Component({
  selector: 'app-lawyers-home',
  templateUrl: './lawyers-home.component.html',
  styleUrls: ['./lawyers-home.component.scss']
})
export class LawyersHomeComponent implements OnInit, OnDestroy {
  @ViewChild('signInForm') signInForm;
  @ViewChild('signUpForm') signUpForm;

  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(
    private readonly modalService: ModalDialogService,
    private readonly viewRef: ViewContainerRef,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop,
    private readonly authDialogService: AuthDialogService
  ) {}

  ngOnInit() {
    this.scrollToTop.scroll(this.router);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  triggerSignin(): void {
    this.authDialogService.openSigninDialog();
  }

  triggerSignup(): void {
    this.authDialogService.openSignupDialog();
  }
}
