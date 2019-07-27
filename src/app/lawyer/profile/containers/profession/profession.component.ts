import { ProfessionalProfile } from './../../../../core/lawyer/professional-profile.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';

@Component({
  selector: "app-profession",
  templateUrl: "./profession.component.html",
  styleUrls: ["./profession.component.scss"]
})
export class ProfessionComponent extends ProfileTabComponent implements OnInit {
  professions = [
    { value: "LAWYER", label: "Lawyer" },
    { value: "PARALEGAL", label: "Paralegal" },
    { value: "LLLT", label: "Limited Legal Licensed Technician (LLLT)" },
    { value: "MEDIATOR", label: "Mediator" }
  ];

  professionForm: FormGroup;
  selectedValue: string;

  constructor(protected profileService: ProfileService) {
    super(profileService);
    this.profileService.change.subscribe(() => {
      this.selectedValue = this.profile.info.profession;
      this.setFormValue('profession');
      this.profileService.onFieldChange(this.form());
    });
  }

  onInit() {
    this.professionForm = new FormGroup({
      profession: new FormControl('', Validators.required)
    });
    this.profileService.emitSaveButton(false);
  }

  onRadioChange(event) {
    this.setFormValue('profession', event.value);
    this.profileService.onFieldChange(this.form());

    const newLabel = this.professions.find(p => { return p.value === event.value; }).label;
    if (this.selectedValue) {
      const previousLabel = this.professions.find(p => { return p.value === this.selectedValue; }).label;
      const successText = `You've changed your from title from a '${previousLabel}' to a '${newLabel}'.`
      this.profileService.submit(successText);
    } else {
      this.profileService.submit(`You've changed your title to '${newLabel}.'`);
    }
  }

  form() {
    return this.professionForm;
  }
}
