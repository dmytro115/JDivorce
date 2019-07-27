import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  alertText = '';
  digest;
  isFormVisible = false;
  isInvalidDigest = false;
  isDialog = false;

  @Output() triggerSignin = new EventEmitter<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.createForm();
    this.route.params.subscribe(params => {
      this.digest = params['digest'];
    });

    this.authService
      .checkPasswordResetDigest(this.digest)
      .subscribe(
        ({ response }) => {
          if (response) {
            this.isFormVisible = true;
          } else {
            this.isInvalidDigest = true;
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  get form(): { [key: string]: AbstractControl; } {
    return this.resetForm.controls;
  }

  createForm(): void {
    this.resetForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl('', [Validators.required, this.matchOtherValidator('password')])
    });
  }

  onChangeInput(): void {
    this.form.confirm.setErrors(undefined);
    this.form.password.setErrors(undefined);
    this.form.confirm.updateValueAndValidity();
    this.form.password.updateValueAndValidity();
  }

  submit(): void {
    this.authService
      .reset(this.form.password.value, this.form.confirm.value, this.digest)
      .subscribe(apiResponse => {
          const email = apiResponse.response;
          this.alertText = '';
          this.router.navigate(['/auth/login', { email }]);
        },
        error => {
          // if (error.status === 401) {
          //   this.alertText = "Invalid email or password.";
          //   this.form.email.setErrors({ incorrect: true });
          //   this.form.password.setErrors({ incorrect: true });
          // } else {
          //   console.log(error);
          // }
        },
        () => { }
      );
  }

  login($event): void {
    if (this.isDialog) {
      event.stopPropagation();
      event.preventDefault();
      this.triggerSignin.emit(true);
    }
  }

  private matchOtherValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const otherControl: AbstractControl = control.root.get(otherControlName);

      if (otherControl) {
        const subscription: Subscription = otherControl
          .valueChanges
          .subscribe(() => {
            control.updateValueAndValidity();
            subscription.unsubscribe();
          });
      }

      return (otherControl && control.value !== otherControl.value) ? { match: true } : undefined;
    };
  }
}
