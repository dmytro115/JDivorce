import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService, Client } from '../../../../core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() isDialog = false;
  @Input() hideLogin = false;
  @Input() infoMessage = undefined;
  @Input() email = undefined;
  @Input() hideLawyerSignup = false;
  @Output() registerSuccess = new EventEmitter<boolean>();
  @Output() triggerForgetPassword = new EventEmitter<boolean>();
  @Output() triggerSignin = new EventEmitter<boolean>();
  @Input() registeredFrom: string;

  signUpForm: FormGroup;
  alertText: string;
  currentUrl: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.email) {
      this.signUpForm.get('email').setValue(this.email);
    }
  }

  createForm(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: new FormControl({ disabled: true, value: '' }, [Validators.required]),
      lastName: new FormControl({ disabled: true, value: '' }, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [ Validators.required, this.matchOtherValidator('password')]),
      terms: new FormControl('', [ Validators.required]),
      isLawyer: new FormControl(false, [])
    });

    this.signUpForm.controls.isLawyer.valueChanges.subscribe((v: boolean) => {
      if (v) {
        this.signUpForm.get('firstName').enable();
        this.signUpForm.get('lastName').enable();
      } else {
        this.signUpForm.get('firstName').disable();
        this.signUpForm.get('lastName').disable();
      }
    })
  }

  // Convenience getter for easy access to form fields.
  get form(): { [key: string]: AbstractControl; } {
    return this.signUpForm.controls;
  }

  signUp(): void {
    if (this.form.isLawyer.value) {
      this.authService
        .registerLawyer(
          this.form.firstName.value,
          this.form.lastName.value,
          this.form.email.value,
          this.form.password.value,
          this.form.confirmPassword.value
        )
        .pipe(first())
        .subscribe(
          (client: Client) => {
            this.alertText = '';
          },
          error => {
            // user already exists
            if (error.status === 409) {
              this.alertText = 'This email is already taken!';
            }
          },
          () => {
            this.registerSuccess.emit(true);
            this.gotoDashboard();
          }
        );
    } else {
      this.authService.register(
        this.form.email.value, 
        this.form.password.value, 
        this.form.confirmPassword.value
        )
        .pipe(first())
        .subscribe(
          (client: Client) => {
            this.alertText = '';
          },
          errorResponse => {
            // user already exists
            if (errorResponse.status === 409) {
              this.alertText = 'This email is already taken!';
            }
          },
          () => {
            this.registerSuccess.emit(true);
            this.gotoDashboard();
          }
        );
    }
  }

  gotoDashboard(): void {
    this.authService.getLoggedInUser().subscribe((data: any) => {
      if (this.authService.isLawyer()) {
        this.router.navigate(['a/l/dashboard']);
      } else {
        if (this.registeredFrom === '/') {
          this.router.navigate(['/a/c/divorce']);
        } else if (this.registeredFrom === '/domestic-violence') {
          this.router.navigate(['/a/c/domestic-violence']);
        }
      }
    });
  }

  signIn(event: MouseEvent): void {
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
