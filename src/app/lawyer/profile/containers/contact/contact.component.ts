import { AddressData } from './../../../../shared/components/google-address-input/address-data.interface';
import { ProfessionalProfile } from 'src/app/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';

const phoneNumberValidationPattern = '(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}';

@Component({
  selector: 'app-profile-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends ProfileTabComponent implements OnInit {
  contactForm: FormGroup;
  address: AddressData;
  isLoaded: boolean = false;

  constructor(protected profileService: ProfileService) {
    super(profileService);
    this.profileService.change.subscribe(() => {
      this.setFormValue('first_name');
      this.setFormValue('last_name');
      this.setFormValue('email');
      this.setFormValue('phone');
      this.setFormValue('address');
      this.address = this.profileService.profile.info.address || {};
      this.profileService.onFieldChange(this.form());
      this.isLoaded = true;
    });
  }

  onInit() {
    this.contactForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern(phoneNumberValidationPattern)]),
      address: new FormControl({}, Validators.required)
    });

    this.profileService.emitSaveButton(true);
  }

  form(): FormGroup {
    return this.contactForm;
  }

  onAddressData(data) {
    this.form().get('address').setValue(data);
    this.onFieldChange();
  }
}
