import { ContactUsService } from './../../core/contact-us/contact-us.service';
import { Component, OnInit } from "@angular/core";
import { ClientService } from './../../core/client/client.service';
import { Router } from "@angular/router";
import {
  AuthService,
  Client,
  BeginDivorceApplicationService
} from "../../core";
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evie-landing-temp',
  templateUrl: './evie-landing-temp.component.html',
  styleUrls: ['./evie-landing-temp.component.scss']
})

export class EvieLandingTempComponent implements OnInit {
  client: Client;
  lastScrollTop: any;
  isVideoVisible = false;
  data;
  precheckCompleted = false;
  zip = '';
  haveDependents = 'N';
  shareTheCustody = 'N';
  activeTab = 1;

  first = false;
  second = false;
  third = false;

  contactForm: FormGroup;
  alertText: string;
  isRequestInProgress: boolean = false;
  isSuccess: boolean = false;
  topics: string = "";

  showLawyersBlock: boolean = false;

  prepareHeroTitle: string = 'divorce';

  constructor(
    private router: Router,
    private beginDivorceApplicationService: BeginDivorceApplicationService,
    private authService: AuthService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private contactUsService: ContactUsService
  ) { this.createForm(); }

  ngOnInit() {
    if (this.router.url === "/d") {
      this.beginDivorceApplicationService.beginApplication("landing").subscribe(
        (client: Client) => {
          this.client = client;
          this.showLawyersBlock = true;
        },
        error => console.log(error),
      );
    }

    if ('querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
      // Function to animate the scroll
      var smoothScroll = function (anchor, duration) {
        // Calculate how far and how fast to scroll
        var startLocation = window.pageYOffset;
        var endLocation = anchor.offsetTop - 40; // Remove 40 pixels for padding
        var distance = endLocation - startLocation;
        var increments = distance / (duration / 16);
        var stopAnimation;
        // Scroll the page by an increment, and check if it's time to stop
        var animateScroll = function () {
          window.scrollBy(0, increments);
          stopAnimation();
        };
        // If scrolling down
        if (increments >= 0) {
          // Stop animation when you reach the anchor OR the bottom of the page
          stopAnimation = function () {
            var travelled = window.pageYOffset;
            if ((travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight)) {
              clearInterval(runAnimation);
            }
          };
        }
        // Loop the animation function
        var runAnimation = setInterval(animateScroll, 16);
      };

      // Define smooth scroll links
      var scrollToggle = document.querySelectorAll('.scroll');
      // For each smooth scroll link
      [].forEach.call(scrollToggle, function (toggle) {
        // When the smooth scroll link is clicked
        toggle.addEventListener('click', function (e) {
          // Prevent the default link behavior
          e.preventDefault();
          // Get anchor link and calculate distance from the top
          var dataTarget = document.querySelector('.landing__section');
          var dataSpeed = toggle.getAttribute('data-speed');
          // If the anchor exists
          if (dataTarget) {
            // Scroll to the anchor
            smoothScroll(dataTarget, dataSpeed || 700);
          }
        }, false);
      });
    }

    if (this.router.url === '/domesticviolence') {
      this.prepareHeroTitle = 'domestic violence';
    }
  }


  createForm() {
    this.contactForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      name: new FormControl('', [
        Validators.required
      ]),
      feedback: new FormControl('', [
        Validators.required
      ]),
      phone: new FormControl('', []),
      topic: new FormControl('', [])
    });
  }

  // Convenience getter for easy access to form fields.
  get form() { return this.contactForm.controls; }

  contact() {
    this.isRequestInProgress = true;
    this.isSuccess = false;
    this.topics = this.getCheckedTopics();
    this.contactUsService.sendContactUsRequest(
      this.form.email.value,
      this.form.name.value,
      this.form.feedback.value,
      "Contact Form",
      this.form.phone.value,
      this.topics
    ).subscribe((resp: any) => {
      this.isRequestInProgress = false;
      this.createForm();
      this.isSuccess = true;
    })
  }

  getCheckedTopics() {
    var checkedTopics = []
    $.each($("input[name='topic']:checked"), function() {
      checkedTopics.push($(this).val());
    });

    return checkedTopics.join(", ");
  }

  changeTab(index) {
    this.activeTab = index;
  }

  onVideoOpen() {
    this.isVideoVisible = true;
  }

  onVideoClose() {
    this.isVideoVisible = false;
  }

  beginApplicationAction() {
    if (this.showLawyersBlock) {
      this.loadUpdates();
    } else {
      this.beginApplication();
    }
  }

  beginApplication() {
    if (this.showLawyersBlock) {
      this.loadUpdates();
    } else {
      this.beginDivorceApplicationService.beginApplication("landing").subscribe(
        (client: Client) => {
          this.client = client;

          this.loadUpdates();
        },
        error => console.log(error),
      );
    }
  }

  goToAdminDashboard(userData) {
    if (this.authService.isLawyer()) {
      this.router.navigate(["a/l/dashboard"]);
    } else {
      // const url = userData.forms['PRECHECK'].actionUrl.split('?');
      // const params = this.getQueryStringParams(url[1]);

      const params = { zip: '', haveDependents: 'N', shareTheCustody: 'N' };
      params['zip'] = this.zip ? this.zip : ''
      params['haveDependents'] = this.first ? 'Y' : 'N'
      params['shareTheCustody'] = (this.second && this.third) ? 'Y' : 'N'

      this.router.navigate(['a/c/questionnaire/precheck/'], { queryParams: params });
    }
  }

  onCheckboxChange(e) {
    this[e.target.name] = e.target.checked;
  }

  onZipChange(e) {
    this.zip = e.target.value
  }

  getQueryStringParams(query) {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          let [key, value] = param.split('=');
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {}
        )
      : {}
  };

  loadUpdates() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.data = data;
        setTimeout(() => { this.precheckCompleted = data.precheck_completed; });

        this.goToAdminDashboard(this.data);
      },
      error => {
        console.log(error);
      }
    );
  }
}

