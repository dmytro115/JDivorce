import { Component } from '@angular/core';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

import { Lawyer } from '../../core/lawyer/lawyer.model';
import { LawyerProfileService } from '../../core/lawyer/lawyer-profile.service';

@Component({
  selector: 'app-lawyers-page',
  templateUrl: './lawyers-page.component.html',
  styleUrls: [
    './lawyers-page.component.scss'
  ]
})
export class LawyersPageComponent {
  profiles: Array<any>;

  constructor(private sanitizer: DomSanitizer, private professionalProfileService: LawyerProfileService) { }

  ngOnInit() {
    this.professionalProfileService.listPublic(15).subscribe((profiles: Array<any>) => {
      this.profiles = profiles;
    });
  }

  profileUrl(url) {
    return url || environment.localUrl + '/assets/images/profile/default-lawyer.svg';
  }
}
