import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthDialogActions } from '../../../auth-dialog-actions.enum';

@Component({
  selector: 'app-forget-pass-dialog',
  templateUrl: './forget-pass-dialog.component.html',
  styleUrls: ['./forget-pass-dialog.component.scss']
})
export class ForgetPassDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ForgetPassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  close(): void {
    this.dialogRef.close();
  }

  onForgetSuccess(): void {
    this.close();
  }

  onTriggerSignin(): void {
    this.close();
    this.data.action$.next(AuthDialogActions.TRIGGER_SIGN_IN);
  }
}
