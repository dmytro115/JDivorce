import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { first } from 'rxjs/operators';
import { AuthService, PNotifyService } from '../../../../core';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {
  @Input() isDialog = false;
  @Output() forgetSuccess = new EventEmitter<boolean>();
  @Output() triggerSignin = new EventEmitter<boolean>();

  forgotPasswordForm: FormGroup;
  alertText: string;
  user: any = {};
  forgotPasswordValues: any = { email: '' };
  pnotify: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cookieService: CookieService,
    private readonly pnotifyService: PNotifyService
  ) {}

  ngOnInit(): void {
    this.pnotify = this.pnotifyService.get();
    this.createForm();
    this.user = this.authService.getCurrentUser();
    this.forgotPasswordValues = JSON.parse(this.cookieService.get('forgotPasswordValues') || '{}');
    this.forgotPasswordForm.patchValue({
      user_email: this.forgotPasswordValues.user_email
    });
  }

  createForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      user_email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  // Convenience getter for easy access to form fields.
  get form(): { [key: string]: AbstractControl; } {
    return this.forgotPasswordForm.controls;
  }

  signIn(event: MouseEvent): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerSignin.emit(true);
    }
  }

  submit(): void {
    this.authService
      .forgotPassword(this.form.user_email.value)
      .pipe(first())
      .subscribe(() => {
          this.alertText = '';
          this.pnotify.success({
            title: 'Success!',
            text: 'A password reset email has been sent to you.'
          });
        },
        () => {
          // if (error.status === 401) {
          //   this.alertText = "Invalid email or password.";
          //   this.form.email.setErrors({ incorrect: true });
          //   this.form.password.setErrors({ incorrect: true });
          // } else {
          //   console.log(error);
          // }
        },
        () => {
          if (this.isDialog) {
            this.forgetSuccess.emit(true);
          } else {
            this.router.navigate(['/auth/login']);
          }
        }
      );
  }

  onChangeEmailOrPass(): void {
    this.form.user_email.setErrors(undefined);
    this.form.user_email.updateValueAndValidity();
  }
}
