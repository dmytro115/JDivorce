import { Location } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Client, LawyerProfileService, LawyerService, ProfessionalProfile } from '../../../core';
import { Lawyer } from '../../../core/lawyer/lawyer.model';
import { ProfileImgPipe } from '../../pipes/profile-img.pipe';

@Component({
  selector: 'app-lawyer-profile-contact',
  templateUrl: './lawyer-profile-contact.component.html',
  styleUrls: [
    './lawyer-profile-contact.component.scss',
    '../../../../assets/neuethemes/samuel/assets/vendor/flaticons/flaticon.min.css',
    '../../../../assets/neuethemes/samuel/assets/vendor/hover/css/hover-min.css',
    '../../../../assets/neuethemes/samuel/assets/vendor/mfp/css/magnific-popup.min.css',
    '../../../../assets/neuethemes/samuel/assets/vendor/owl-carousel/assets/owl.carousel.min.css',
    '../../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/style.css',
    '../../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/layouts/samuel.css',
    '../../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/colors/default.css'
  ],
  providers: [ProfileImgPipe]
})

export class LawyerProfileContactComponent implements OnInit {
  profile: any;
  client: Client;
  contactForm: FormGroup;

  @HostBinding('class.profileBg') customBg = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly lawyerService: LawyerService,
    private readonly translate: TranslateService,
    private readonly _location: Location,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly profileImgPipe: ProfileImgPipe,
    private readonly _formBuilder: FormBuilder
  ) {
    this.loadNeueThemeJSLibraries();
  }

  ngOnInit() {
    this.customBg = true;

    this.contactForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      feedback: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const slug = params.get('id');

      this.professionalProfileService.show(slug).subscribe((profile: ProfessionalProfile) => {
        this.profile = profile;
        const info = profile.info;

        if (info.practice_areas) {
          info.practice_areas.forEach((practiceArea, index) => {
            practiceArea.colorClass = 'ui-menu-color0' + (index + 1 % 6);
            practiceArea.animationDelay = 100 + 200 * index;
          });
        }

        // TODO: Don't hardcode the index.
        info.plans[0].colorClass = 'ui-menu-color01';
        info.plans[1].colorClass = 'ui-menu-color04';
        info.plans[2].colorClass = 'ui-menu-color05';

        info.profileURL = environment.localUrl + '/lawyer/' + this.profile.slug;

        if (info.video_question_and_answers) {
          let videoRows = [];
          for (let i = 0; i < info.video_question_and_answers.length; i += 2) {
            videoRows.push(info.video_question_and_answers.slice(i, i + 2));
          }
          info.videoRows = videoRows;
        }
      });
    });
  }

  navigateBack() {
    this._location.back();
  }

  loadNeueThemeJSLibraries() {
    const scripts: Array<string> = [
      'https://npmcdn.com/imagesloaded@4.1/imagesloaded.pkgd.min.js',
      'https://unpkg.com/isotope-layout@3.0/dist/isotope.pkgd.min.js',
      'https://unpkg.com/scrollreveal@3.3.2/dist/scrollreveal.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js',
      'assets/neuethemes/samuel/assets/vendor/mfp/js/jquery.magnific-popup.min.js?v=1.1.0',
      'assets/neuethemes/samuel/assets/vendor/progressbar/progressbar.min.js?v=1.0.1',
      'assets/neuethemes/samuel/assets/vendor/anicounter/jquery.counterup.min.js?v=1.0',
      'assets/neuethemes/samuel/assets/vendor/owl-carousel/owl.carousel.min.js?v=2.1.0',
      'assets/neuethemes/samuel/assets/vendor/headlines/headlines.min.js?v=1.0',
      'assets/neuethemes/samuel/assets/custom/2.2.0/js/animation.js',
      'assets/neuethemes/samuel/assets/custom/2.2.0/js/custom.js'
    ];
    for (const script of scripts) {
      this.loadJSLibrary(script);
    }
  }

  loadJSLibrary(name: string): Promise<any> {
    return new Promise(resolve => {
      const script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = name;
      document.head.appendChild(script);
    });
  }

  sendContactMessage() {
    if (this.contactForm.valid) {
      const body = this.contactForm.value;
      body.lawyer_id = this.profile.id;

      this.lawyerService.sendContactEmail(body).subscribe((data: any) => {
        const messageElem = $('#form-messages');
        messageElem.addClass('alert alert-success').html('Your question was sent sucessfully!');
        this.contactForm.reset();
      }, (error: any) => {
        const messageElem = $('#form-messages');
        messageElem.addClass('alert alert-danger').html('Something was wrong!');
      });
    }
  }

  get name() { return this.contactForm.get('name'); }

  get email() { return this.contactForm.get('email'); }

  get feedback() { return this.contactForm.get('feedback'); }
}
