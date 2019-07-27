import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LawyerProfileService, PNotifyService } from '../../../../core';
import { ProfileService } from './../../profile.service';

@Component({
  selector: 'app-staging',
  templateUrl: './staging.component.html',
  styleUrls: ['./staging.component.scss']
})
export class StagingComponent implements OnInit {
  tabs = [
    { title: 'PROFILE.WELCOME.TITLE', path: 'welcome' },
    { title: 'PROFILE.DISPLAY_PICTURE', path: 'display-photo' },
    { title: 'PROFILE.PROFESSION', path: 'profession' },
    { title: 'PROFILE.CONTACT.TITLE', path: 'contact' },
    { title: 'PROFILE.EXPERIENCES', path: 'experiences' },
    { title: 'PROFILE.PRACTICE_AREA', path: 'practice-areas' },
    { title: 'PROFILE.RECENT_CASES.TITLE', path: 'recent-cases' },
    { title: 'PROFILE.PRICING', path: 'pricing' },
    { title: 'PROFILE.CALENDAR', path: 'calendar' },
    { title: 'PROFILE.PREVIEW',  path: 'preview' },
    { title: 'PROFILE.SETTING.TITLE', path: 'settings' }
  ];

  showSaveButton = false;
  pnotify: any;

  constructor(
    private readonly profileService: ProfileService,
    private readonly authService: AuthService,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly pnotifyService: PNotifyService,
    private readonly router: Router
  ) {
    this.pnotify = pnotifyService.get();
    this.profileService.showSaveButton$.subscribe((value: boolean) => {
      setTimeout(() => {
        this.showSaveButton = value;
      });
    });
  }

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {}

  onSubmit(e: any): void {
    e.preventDefault();

    if (this.profileService.isValid) {
      this.professionalProfileService.update({
        lawyer_id: this.authService.getCurrentUser().id,
        lawyer: { info: this.profileService.profile.info }
      }).subscribe(
        response => {
          this.pnotify.success({
            text: 'Information is saved!',
            delay: 2000
          });

          this.nextTab();
        },
        err => console.log(err)
      );
    } else {
      this.profileService.invalidForm.emit();
    }
  }

  nextTab(): void {
    const parts = this.router.url.split('/');
    const tab = parts[parts.length - 1];
    const currentTabIndex = this.tabs.findIndex(t => t.path === tab);
    const nextTabPath =
      typeof this.tabs[currentTabIndex + 1] !== 'undefined'
        ? this.tabs[currentTabIndex + 1].path
        : undefined;

    if (nextTabPath) {
      this.router.navigate([`/a/l/profile/${nextTabPath}`]);
    }
  }
}
