import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../core';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  alertText: string;
  redirectUrl: string;

  @Input() isDialog = false;
  @Output() signInSuccess = new EventEmitter<boolean>();
  @Output() triggerRegister = new EventEmitter<boolean>();
  @Output() triggerForgetPassword = new EventEmitter<boolean>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.route.url.subscribe((url: Array<UrlSegment>) => {
      const login = url[0];
      const email = login.parameters.email;
      if (email) {
        this.form.email.setValue(email);
      }

      const redirectUrl = login.parameters.redirect;
      if (redirectUrl) {
        this.redirectUrl = redirectUrl;
        this.alertText = "You're not logged in. Please login first!";
      }
    });
  }

  createForm(): void {
    this.signInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: ''
    });
  }

  signIn(): void {
    this.authService
      .login(this.signInForm.value.email, this.signInForm.value.password)
      .pipe(first())
      .subscribe(
        (user: any) => {
          let url = this.redirectUrl;
          if (!url) {
            if (this.authService.isLawyer()) {
              url = '/a/l/dashboard';
            } else {
              url = '/a/c/dashboard';
            }
          }
          this.alertText = undefined;
          this.router.navigate([url]);
        },
        ({ status }) => {
          this.signInForm.reset();
          if (status === 403) {
            this.alertText = 'Sorry, this email and password combination is incorrect.';
          }
        },
        () => {
          this.alertText = undefined;
          this.signInSuccess.emit(true);
        }
      );
  }

  get form(): { [key: string]: AbstractControl; } {
    return this.signInForm.controls;
  }

  forgetPassword(event: MouseEvent): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerForgetPassword.emit(true);
    }
  }

  signUp(event: MouseEvent): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerRegister.emit(true);
    }
  }
}
