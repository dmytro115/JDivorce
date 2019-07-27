import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { environment } from '../../../environments/environment';
import { CalendarSlot, Lawyer, LawyerCalendarService, LawyerProfileService, ProfessionalProfile } from '../../core';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, BeginDivorceApplicationService } from '../../core';
import * as dayjs from 'dayjs';
import * as $ from 'jquery';

import { OrderPipe } from 'ngx-order-pipe';
import { ProfileImgPipe } from '../pipes/profile-img.pipe';

@Component({
  selector: 'app-lawyer-profile',
  templateUrl: './lawyer-profile.component.html',
  styleUrls: [
    './lawyer-profile.component.scss',
    '../../../assets/neuethemes/samuel/assets/vendor/flaticons/flaticon.min.css',
    '../../../assets/neuethemes/samuel/assets/vendor/hover/css/hover-min.css',
    '../../../assets/neuethemes/samuel/assets/vendor/mfp/css/magnific-popup.min.css',
    '../../../assets/neuethemes/samuel/assets/vendor/owl-carousel/assets/owl.carousel.min.css',
    '../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/style.css',
    '../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/layouts/samuel.css',
    '../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/colors/default.css'
  ],
  providers: [ ProfileImgPipe ]
})

export class LawyerProfileComponent implements OnInit {
  @Input() profileId: string = null;
  @Input() isNavigable: boolean = true;

  profile: ProfessionalProfile;
  client: Client;
  selectedVideoKey: string;
  selectedLawyer: Lawyer;

  lawyerPackages: any = [];
  appointmentDate: any;

  slideConfig: any = {
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true
  };

  lawyerSlots: any = [];
  selectedSlot: any = {};
  selectedPackage: any = {};

  @HostBinding('class.profileBg') customBg: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private beginDivorceApplicationService: BeginDivorceApplicationService,
    private lawyerCalendarService: LawyerCalendarService,
    private profileService: LawyerProfileService,
    private profileImgPipe: ProfileImgPipe,
    private _location: Location
  ) {
    this.loadNeueThemeJSLibraries();
  }

  ngOnInit() {
    this.customBg = true;
    this.appointmentDate = dayjs().add(1, 'day');

    this.route.queryParams.subscribe(params => {
      if (params.videoId) {
        this.selectedVideoKey = params.videoId;
      }
    });

    this.route.paramMap.subscribe(params => {
      let slug = params.get('id');
      if (this.profileId && !slug) {
        slug = this.profileId;
      }

      this.profileService.show(slug).subscribe((profile: ProfessionalProfile) => {
        this.profile = profile;
        this.selectedPackage = profile.info.plans[0];
        let info = profile.info;

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
          var videoRows = [];
          for (var i = 0; i < info.video_question_and_answers.length; i += 2) {
            videoRows.push(info.video_question_and_answers.slice(i, i + 2));
          }
          info.videoRows = videoRows;
        }

        this.loadLawyerSlots();
      });
    });
  }

  navigateBack() {
    this._location.back();
  }

  goToCheckout(profile, pkg = null) {
    const selectedPackage = pkg || this.selectedPackage;
    let params = {
      p: profile.slug,
      plan: selectedPackage.id
    };

    if (this.selectedSlot.slot) {
      const slot = dayjs(this.selectedSlot.slot.start_time);
      params['date'] = this.appointmentDate.set('hour', slot.format('H')).set('minute', slot.format('mm')).set('second', 0).set('millisecond', 0).format();
    }

    this.router.navigate(["/a/c/checkout/review", params]);

    // TODO: handle checkout when coming from  a public page
  }

  navigateAppointmentAvailability(direction: string) {
    if (direction === 'right') {
      this.appointmentDate = this.appointmentDate.add(1, 'days');
    } else if (direction === 'left') {
      // Don't go past tomorrow.
      let oldest = dayjs().add(1, 'day');
      let newDate = this.appointmentDate.subtract(1, 'day');
      this.appointmentDate = dayjs(Math.max(oldest.valueOf(), newDate.valueOf()));
    }

    this.loadLawyerSlots();
  }

  loadLawyerSlots() {
    this.lawyerCalendarService.getLawyerSlots(this.appointmentDate.format('MM/DD/YYYY'), this.profile.id).subscribe((response: any) => {
      this.lawyerSlots = response;

      if (this.lawyerSlots[0]) {
        this.profile['start_apppointment_time'] = this.lawyerSlots[0].start_time;
      }
    });
  }

  isSlotSelected(slot, lawyerId) {
    return (slot == this.selectedSlot.slot) && (lawyerId === this.selectedSlot.lawyer_id)
  }

  selectSlot(event, slot, lawyer_id) {
    if (!slot.availability) return;

    if (this.selectedSlot.slot == slot || !slot.availability) {
      this.selectedSlot = {};
    } else {
      this.selectedSlot = { lawyer_id: lawyer_id, slot: slot };
    }

    if ($(event.target).hasClass('active')) {
      $(event.target).parents('.appointment-availability').find('a.select-btn').addClass('disabled');
    } else {
      $(event.target).parents('.appointment-availability').find('a.select-btn').removeClass('disabled');
    }
  }

  changePackage(e, packageObj) {
    $(e.target).parent('label.plan-item').addClass('checked').siblings().removeClass('checked');
    $(e.target).parent('label.plan-item').find('input[type=radio]').attr('checked', 'checked');

    this.selectedPackage = packageObj;
  }

  loadJSLibrary(name: string): Promise<any> {
    return new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = name;
      document.head.appendChild(script);
    });
  }

  loadNeueThemeJSLibraries() {
    let scripts: string[] = [
      'https://npmcdn.com/imagesloaded@4.1/imagesloaded.pkgd.min.js',
      'https://unpkg.com/isotope-layout@3.0/dist/isotope.pkgd.min.js',
      'https://unpkg.com/scrollreveal@3.3.2/dist/scrollreveal.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js',
      'assets/neuethemes/samuel/assets/vendor/mfp/js/jquery.magnific-popup.min.js?v=1.1.0',
      'assets/neuethemes/samuel/assets/vendor/progressbar/progressbar.min.js?v=1.0.1',
      'assets/neuethemes/samuel/assets/vendor/anicounter/jquery.counterup.min.js?v=1.0',
      'https://cdnjs.cloudflare.com/ajax/libs/jquery.pjax/2.0.1/jquery.pjax.min.js',
      'assets/neuethemes/samuel/assets/vendor/owl-carousel/owl.carousel.min.js?v=2.1.0',
      'assets/neuethemes/samuel/assets/vendor/headlines/headlines.min.js?v=1.0',
      'assets/neuethemes/samuel/assets/custom/2.2.0/js/animation.js',
      'assets/neuethemes/samuel/assets/custom/2.2.0/js/custom.js'
    ];
    for (let script of scripts) {
      this.loadJSLibrary(script);
    }
  }
}
