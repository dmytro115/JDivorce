import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-questionnaire-list-dialog',
  templateUrl: 'questionnaire-list-dialog.component.html'
})
export class QuestionnaireListDialogComponent {
  constructor(public dialogRef: MatDialogRef<QuestionnaireListDialogComponent>) { }
}
