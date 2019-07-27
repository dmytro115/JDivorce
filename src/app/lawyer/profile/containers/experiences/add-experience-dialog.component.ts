import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';
import { AddExperienceData, Experience } from './experience.interface'

@Component({
  selector: 'app-add-experience-dialog',
  templateUrl: './add-experience-dialog.component.html',
  styleUrls: ['./add-experience-dialog.component.scss']
})
export class AddExperienceDialogComponent extends ProfileTabComponent implements OnInit {
  addExperienceForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddExperienceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddExperienceData,
    protected profileService: ProfileService
  ) {
    super(profileService);
  }

  onInit() {
    this.addExperienceForm = new FormGroup({
      title: new FormControl(this.data.element.title, Validators.required),
      subtitle: new FormControl(this.data.element.subtitle, Validators.required),
      from_timestamp: new FormControl(this.data.element.from_timestamp, Validators.required),
      to_timestamp: new FormControl(this.data.element.to_timestamp, Validators.required),
      current_work: new FormControl(this.data.element.current_work)
    });

    if (this.data.element.current_work) {
      this.addExperienceForm.get('to_timestamp').disable();
    } else {
      this.addExperienceForm.get('to_timestamp').setValidators([Validators.required]);
    }

    // Disable the "to" field if the experience being added is "current".
    this.addExperienceForm.get('current_work').valueChanges.subscribe(isCurrent => {
      if (isCurrent) {
        this.addExperienceForm.get('to_timestamp').disable();
        this.addExperienceForm.get('to_timestamp').setValidators(null);
      } else {
        this.addExperienceForm.get('to_timestamp').enable();
        this.addExperienceForm.get('to_timestamp').setValidators([Validators.required]);
      }
    });
  }

  form() {
    return this.addExperienceForm;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
