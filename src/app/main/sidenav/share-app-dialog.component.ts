import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PNotifyService, ShareAppService } from '../../core';

@Component({
  selector: 'app-dialog-overview-example-dialog',
  templateUrl: 'share-app-dialog.component.html'
})
export class ShareAppDialogComponent {
  pnotify: any;
  email: string;

  constructor(
    private readonly shareAppService: ShareAppService,
    public dialogRef: MatDialogRef<ShareAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    pnotifyService: PNotifyService
  ) {
    this.pnotify = pnotifyService.get();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  shareApp(): void {
    this.shareAppService.share(this.email).subscribe(
      response => {
        this.dialogRef.close();
        this.pnotify.success({
          text: response,
          delay: 3000
        });
      },
      ({ status, error }) => {
        let errorMessage = 'Oops, something went wrong.';
        if (status === 403) {
          errorMessage = error.error;
        }

        this.pnotify.error({
          text: errorMessage,
          delay: 5000
        });
      }
    );
  }
}
