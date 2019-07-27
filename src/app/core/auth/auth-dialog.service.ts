import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { AuthDialogActions } from './auth-dialog-actions.enum';
import { ForgetPassDialogComponent } from './components/forget-pass/forget-pass-dialog/forget-pass-dialog.component';
import { RegisterDialogComponent } from './components/register/register-dialog/register-dialog.component';
import { SigninDialogComponent } from './components/signin/signin-dialog/signin-dialog.component';

// Use this service to open up the auth dialogs from anywhere in the application.
// Example: this.authDialogService.openSignupDialog();
@Injectable({ providedIn: 'root' })
export class AuthDialogService {
  private static readonly dialogWidth = '450px';

  constructor(public dialog: MatDialog) {}

  openSigninDialog(): void {
    this.openAuthDialog(SigninDialogComponent);
  }

  openSignupDialog(
    optionalData: { hideLawyerSignup?: boolean; hideLogin?: boolean, infoMessage?: string, email?: string, registeredFrom?: string } = {
      hideLawyerSignup: false,
      hideLogin: false,
      infoMessage: undefined,
      email: undefined,
      registeredFrom: undefined
    }
  ): void {
    this.openAuthDialog(RegisterDialogComponent, optionalData);
  }

  openForgetPasswordDialog(): void {
    this.openAuthDialog(ForgetPassDialogComponent);
  }

  private openAuthDialog(component: any, optionalData: any = {}): void {
    const data = { ...{ action$: new Subject<string>() }, ...optionalData }; // https://stackoverflow.com/a/47517759
    this.dialog.open(component, {
      width: AuthDialogService.dialogWidth,
      data
    });

    data.action$.subscribe((key: string) => {
      switch (key) {
        case AuthDialogActions.TRIGGER_SIGN_IN.toString(): {
          this.openSigninDialog();
          break;
        }
        case AuthDialogActions.TRIGGER_SIGN_UP.toString(): {
          this.openSignupDialog();
          break;
        }
        case AuthDialogActions.TRIGGER_FORGET_PASSWORD.toString(): {
          this.openForgetPasswordDialog();
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
