import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';
import { AddRecentCasesData, RecentCase } from './recent-case.interface'

@Component({
  selector: 'app-add-recent-cases-dialog',
  templateUrl: './add-recent-cases-dialog.component.html',
  styleUrls: ['./add-recent-cases-dialog.component.scss']
})
export class AddRecentCasesDialogComponent extends ProfileTabComponent implements OnInit {
  addRecentCaseForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddRecentCasesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddRecentCasesData,
    protected profileService: ProfileService
  ) {
    super(profileService);
  }

  onInit() {
    this.addRecentCaseForm = new FormGroup({
      title: new FormControl(this.data.element.title, Validators.required)
    });
  }

  form() {
    return this.addRecentCaseForm;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
