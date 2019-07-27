import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthDialogActions } from '../../../auth-dialog-actions.enum';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  close(): void {
    this.dialogRef.close();
  }

  onRegisterSuccess(): void {
    this.close();
  }

  onTriggerSignin(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_SIGN_IN);
  }

  onTriggerForgetPassword(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_FORGET_PASSWORD);
  }
}
