import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";

import { Lawyer } from '../../../core/lawyer/lawyer.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LawyerService, Client, BeginDivorceApplicationService } from '../../../core';
import { environment } from '../../../../environments/environment';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-lawyer-plans',
  templateUrl: './lawyer-plans.component.html',
  styleUrls: [
    './lawyer-plans.component.scss',
    '../../../../assets/neuethemes/samuel/assets/vendor/flaticons/flaticon.min.css',
    '../../../../assets/neuethemes/samuel/assets/vendor/hover/css/hover-min.css',
    '../../../../assets/neuethemes/samuel/assets/vendor/mfp/css/magnific-popup.min.css',
    '../../../../assets/neuethemes/samuel/assets/vendor/owl-carousel/assets/owl.carousel.min.css',
    '../../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/style.css',
    '../../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/layouts/samuel.css',
    '../../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/colors/default.css'
  ]
})

export class LawyerPlansComponent implements OnInit {
  lawyer: any;
  qParams: Observable<{fromCheckout: boolean, fromAnalysis: boolean, fromDHome: boolean}> = null;
  client: Client;
  offeringDescriptions: any;

  lawyerPackages: any = [];

  @HostBinding('class.profileBg') customBg: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private lawyerService: LawyerService,
    private translate: TranslateService,
    private beginDivorceApplicationService: BeginDivorceApplicationService
  ) {
    this.loadNeueThemeJSLibraries();

    this.offeringDescriptions = {
      packageOffering1: {
        SQ001: "Complete review of documents",
        SQ003: "Written case strategy",
        SQ004: "Arrange for temporary motions for child support",
        SQ005: "Arrange for temporary motions for parenting plan",
        SQ006: "Parent Plan",
        SQ007: "Get restraining order",
        SQ008: "Filling the documents at court(client is responsible for the court fees)",
        SQ009: "Finalizing the divorce"
      },
      packageOffering2: {
        SQ001: "Complete review of documents",
        SQ003: "Written case strategy",
        SQ004: "Arrange for temporary motions for child support",
        SQ005: "Arrange for temporary motions for parenting plan",
        SQ006: "Parent Plan",
        SQ007: "Get restraining order",
        SQ008: "Filling the documents at court(client is responsible for the court fees)",
        SQ009: "Finalizing the divorce"
      }
    };
  }

  ngOnInit() {
    this.customBg = true;

    this.qParams = this.route.queryParams.pipe(map((params: any) => {
      return params;
    }));

    this.route.data.subscribe((data: { lawyer: Lawyer }) => {
      this.lawyer = data.lawyer;

      if (this.haveCustomPackages(this.lawyer)) {
        this.lawyerPackages = this.getPackages(this.lawyer.info.profile_forms['PACKAGE_PLAN'].response);
      }

      if (this.lawyer.info.practice_areas) {
        this.lawyer.info.practice_areas.forEach((practiceArea, index) => {
          practiceArea.colorClass = 'ui-menu-color0' + (index + 1 % 6);
          practiceArea.animationDelay = 100 + 200 * index;
        });

      }

      if (this.lawyer.info.featuredImage) {
        this.lawyer.info.featured_image = this.lawyer.info.featuredImage;
      } else if (!this.lawyer.info.featured_image) {
        this.lawyer.info.featured_image = environment.localUrl + '/assets/profile/default-lawyer.svg';
      }
    });
  }

  loadNeueThemeJSLibraries() {
    let scripts: string[] = [
      // 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
      // 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
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

  loadJSLibrary(name: string): Promise<any> {
    return new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = name;
      document.head.appendChild(script);
    });
  }

  backToListText(text) {
    return this.translate.instant(text);
  }

  haveCustomPackages(lawyer) {
    return lawyer.info.profile_forms && lawyer.info.profile_forms['PACKAGE_PLAN'].response;
  }

  getPackages(response) {
    var packages = [];

    if (!this.haveCustomPackages) return packages;

    if (response['uncontestNoChild'] === 'Y') {
      packages.push(
        {
          title: 'Uncontested Without Children',
          price: parseFloat(response['priceplan1']),
          description: "This plan is for uncontested dissolutions that don't involve kids. This means couples who are filing for divorce where they agree on the key terms, and do not have any dependent children together. I will prepare and handover the paperwork to you. You will file the paperwork at your county court. Any follow up rquests are not included. I can accompany you to the court but that will be an additional fee.",
          type: 'noChild',
          package_id: 'priceplan1',
          packageOfferings: [
            'Application Review',
            'Case Strategy',
            'Filing the papers in the court'
          ]
        }
      );
    }

    if (response['uncontestWithChild'] === 'Y') {
      packages.push(
        {
          title: 'Uncontested With Children',
          price: parseFloat(response['priceplan2']),
          description: "This plan is for uncontested dissolutions involving kids. This means couples who are filing for divorce where they agree on the key terms, and do have dependent children together. I will prepare and handover the paperwork to you, including the parenting plans. You will file the paperwork at your country court. Any follow up requests are not included. I can accompany you to the court but that will be an additional fee.",
          type: 'withChild',
          package_id: 'priceplan2',
          packageOfferings: [
            'Application Review',
            'Case Strategy',
            'Filing the papers in the court'
          ]
        }
      );
    }

    if (response['packagePrice1']) {
      packages.push(
        {
          title: response['packageTitle1'],
          price: parseFloat(response['packagePrice1']),
          description: response['packageDesc1'],
          package_id: 'packagePrice1',
          packageOfferings: this.getPackageOffering(this.lawyer, 'packageOffering1')
        }
      );
    }

    if (response['packagePrice2']) {
      packages.push(
        {
          title: response['packageTitle2'],
          price: parseFloat(response['packagePrice2']),
          description: response['packageDesc2'],
          package_id: 'packagePrice2',
          packageOfferings: this.getPackageOffering(this.lawyer, 'packageOffering2')
        }
      );
    }

    if (response['hourlyRate']) {
      packages.push(
        {
          title: "Hourly rate",
          price: parseFloat(response['hourlyRate']),
          description: "Any additional requests are at $" + response['hourlyRate'] + " per hour in 60 minute increments.",
          type: 'hourly',
          package_id: 'hourlyRate',
          packageOfferings: []
        }
      );
    }

    return packages;
  }

  getPackageOffering(lawyer, type) {
    let offeringNames = [];
    if (lawyer.info.profile_forms['PACKAGE_PLAN'].response) {
      let packageResponse = lawyer.info.profile_forms['PACKAGE_PLAN'].response;

      for (let key of Object.keys(packageResponse)) {
        if (key.indexOf(type) >= 0) {
          let SQ = key.split(type + '[');
          let SQParam = SQ[1].split(']')[0];

          if (this.offeringDescriptions[type][SQParam]) {
            offeringNames.push(this.offeringDescriptions[type][SQParam]);
          }
        }
      }
    }

    return offeringNames;
  }

  goToReviewPage(lawyer, type, package_id) {
    this.beginDivorceApplicationService.checkoutPlan('profile').subscribe(
      (client: Client) => {
        this.client = client;
      },
      error => console.log(error),
      () => {
        this.goToCheckout(lawyer, type, package_id);
      }
    );
  }

  goToCheckout(lawyer, type, package_id) {
    const queryParams = { lawyer: lawyer.id };

    queryParams['package'] = package_id;
    queryParams['type'] = type;

    this.router.navigate(["/a/c/checkout/review"], {
      queryParams: queryParams
    });
  }
}
