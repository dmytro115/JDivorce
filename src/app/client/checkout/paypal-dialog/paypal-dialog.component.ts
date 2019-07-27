import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-paypal-dialog',
  templateUrl: './paypal-dialog.component.html',
  styleUrls: ['./paypal-dialog.component.scss']
})
export class PaypalDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<PaypalDialogComponent>) {}

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }
}
