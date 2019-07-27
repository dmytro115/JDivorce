import { ProfessionalProfile } from './../../../core/lawyer/professional-profile.interface';
import { Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from './../profile.service';

@Injectable()
export abstract class ProfileTabComponent implements OnInit {
  protected profile: ProfessionalProfile;

  constructor(protected profileService: ProfileService) {
    this.profileService.change.subscribe(() => {
      this.profile = this.profileService.profile;
    });

    this.profileService.invalidForm.subscribe(() => {
      Object.keys(this.form().controls).forEach(field => {
        const control = this.form().get(field);
        control.markAsTouched();
      });
    });
  }

  ngOnInit() {
    this.profileService.fetchData();
    this.onInit();
  }

  setFormValue(key, value = null) {
    if (value === 0 || value === false || value) {
      this.form().get(key).setValue(value);
    } else {
      this.form().get(key).setValue(this.profile.info[key]);
    }
  }

  isFieldError(key, group = null) {
    let control;
    if (group) {
      control = this.form().controls[group]['controls'][key];
    } else {
      control = this.form().controls[key];
    }
    let errors = control.errors;
    return errors && (control.dirty || control.touched);
  }

  onFieldChange(event = null) {
    this.profileService.onFieldChange(this.form());
  }

  abstract form(): FormGroup;
  abstract onInit();
}
