import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileTabComponent } from '../profile-tab.component';
import { NotificationCardStyle } from './../../../../shared/components/notification-card/notification-card-style.enum';
import { ProfileService } from './../../profile.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent extends ProfileTabComponent implements OnInit {
  profileId: string;
  description = 'This is what your profile currently looks like. Any changes that you make will be reflected here immediately.';
  notificationStyle: NotificationCardStyle = NotificationCardStyle.INFO;

  constructor(protected profileService: ProfileService) {
    super(profileService);
    this.profileService.change.subscribe(() => {
      this.profileId = this.profile.id;
    });
    this.profileService.emitSaveButton(false);
  }

  // tslint:disable-next-line: no-empty
  onInit(): void {}

  form(): FormGroup {
    return undefined;
  }
}
