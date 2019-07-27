import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthDialogActions } from '../../../auth-dialog-actions.enum';

@Component({
  selector: 'app-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.scss']
})
export class SigninDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SigninDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  close(): void {
    this.dialogRef.close();
  }

  onSigninSuccess(): void {
    this.close();
  }

  onTriggerSignup(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_SIGN_UP);
  }

  onTriggerForgetPassword(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_FORGET_PASSWORD);
  }
}
