import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PNotifyService } from '../../../../core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  digest: string;
  email: string;
  alertText: string;
  isVerifying = false;
  pnotify: any;
  verificationForm: FormGroup;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly pnotifyService: PNotifyService
  ) {
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    this.createForm();
    this.setupVerification();
  }

  onSubmit(): void {
    const email = this.verificationForm.controls['email'].value;
    this.authService.resendVerificationEmail(email).subscribe(
      (response: any) => {
        if (response.response) {
          this.pnotify.success({
            title: 'Success',
            text: 'The verification email has been sent to your email. Please check your inbox!'
          });
          this.verificationForm.reset();
        } else {
          this.pnotify.error({
            title: 'Oops',
            text: 'Sorry, something went wrong with the verification email. Please try again'
          });
        }
      },
      error => {
        if (error.status === 404) {
          this.alertText = "Did you make a typo? This email doesn't exist.";
        }
      });
  }

  private createForm(): void {
    this.verificationForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  private setupVerification(): void {
    this.route.params.subscribe(params => {
      this.digest = params['c'];
      this.email = params['e'];

      if (this.digest && this.email) {
        this.isVerifying = true;
        this.authService.verifyUser(this.email, this.digest).subscribe(
          (response: any) => {
            this.isVerifying = false;
            if (response.response) {
              this.pnotify.success({
                title: 'Success',
                text: 'Your account is verified!'
              });
              this.router.navigate(['/auth/login']);
            } else if (response.response === false) {
              this.alertText = 'The verification URL is incorrect. Please make sure you click on the link in your email.';
            } else {
              this.alertText = 'This account is already verified.';
            }
          },
          error => {
            this.isVerifying = false;
            if (error.status === 404) {
              this.alertText = 'The verification URL is incorrect. Please make sure you click on the link in your email.';
            }
          }
        );
      }
    });
  }

  get emailControl() {
    return this.verificationForm.controls.email
  }
}
