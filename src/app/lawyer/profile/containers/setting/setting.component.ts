import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileTabComponent } from '../profile-tab.component';
import { LawyerProfileService } from './../../../../core/lawyer/lawyer-profile.service';
import { NotificationCardStyle } from './../../../../shared/components/notification-card/notification-card-style.enum';
import { ProfileService } from './../../profile.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent extends ProfileTabComponent implements OnInit {
  settingsForm: FormGroup;
  completedProfileText = '';
  messages: Array<string> = [];
  notificationStyle: NotificationCardStyle = NotificationCardStyle.INFO;

  private readonly privacySettingsSuccessText = {
    public_profile: {
      true: 'Your profile is now visible to clients.',
      false: 'Your profile is now hidden from clients.'
    },
    accepting_clients: {
      true: 'Clients will now be able to purchase and make appointments with you.',
      false: 'Clients will not be able to purchase and make appointments with you.'
    }
  };

  constructor(protected profileService: ProfileService, private readonly professionalProfileService: LawyerProfileService) {
    super(profileService);
    this.profileService.change.subscribe(() => {
      this.setFormValue('accepting_clients');
      this.setFormValue('public_profile');
      if (this.profileService.profile.info.profile_completed) {
        this.completedProfileText = '';
        this.settingsForm.get('public_profile').enable();
        this.settingsForm.get('accepting_clients').enable();
      } else {
        this.completedProfileText = 'You still need to fill out some more info in your profile before we can show it to potential clients.';
        this.settingsForm.get('public_profile').disable();
        this.settingsForm.get('accepting_clients').disable();
        this.professionalProfileService.showUnfilledStatus().subscribe((response: any) => {
          if (!response.completed) {
            const unfilledFields = response.required;
            this.messages = [];
            unfilledFields.forEach(field => {
              if (field === 'profession') {
                this.messages.push('We need your profession in the \'Profession\' section.');
              } else {
                field.split('_').join(' ');
                this.messages.push(`We need your ${field} in the 'Contact Info' section.`);
              }
            });
          }
        });
      }
      this.profileService.onFieldChange(this.form());
    });
  }

  onInit(): void {
    this.settingsForm = new FormGroup({
      public_profile: new FormControl({ value: false, disabled: true }),
      accepting_clients: new FormControl({ value: false, disabled: true })
    });
    this.profileService.emitSaveButton(false);
  }

  isProfileCompleted(): boolean {
    return this.profileService.profile && this.profileService.profile.info.profile_completed;
  }

  onChange(key: string, event: any): void {
    this.setFormValue(key, event.checked);
    this.profileService.onFieldChange(this.form());
    this.profileService.submit(this.privacySettingsSuccessText[key][event.checked]);
  }

  form(): FormGroup {
    return this.settingsForm;
  }
}
