import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, BeginDivorceApplicationService, Client } from '../../core';
import { QuestionnaireService } from '../../modules/jd-questionnaire/jd-questionnaire.service';
import { ClientService } from './../../core/client/client.service';
import { ContactUsService } from './../../core/contact-us/contact-us.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-domestic-violence-landing',
  templateUrl: './domestic-violence.component.html',
  styleUrls: ['./domestic-violence.component.scss']
})
export class DomesticViolenceComponent implements OnInit {
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
  isRequestInProgress = false;
  isSuccess = false;
  topics = '';
  showQuestionTab = true;
  showLawyersBlock = false;

  prepareHeroTitle = 'divorce';

  pricingBlockCtaButtonOptions = {
    enabled: true,
    text: 'Select'
  };
  plansFilter = [1];

  constructor(
    private readonly router: Router,
    private readonly beginDivorceApplicationService: BeginDivorceApplicationService,
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly formBuilder: FormBuilder,
    private readonly contactUsService: ContactUsService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.router.url === '/d') {
      this.showQuestionTab = false;
      this.activeTab = 2;
      this.beginDivorceApplicationService.beginApplication('landing').subscribe(
        (client: Client) => {
          this.client = client;
          this.showLawyersBlock = true;
        },
        error => console.log(error)
      );
    }

    if (this.router.url === '/domestic-violence') {
      this.prepareHeroTitle = 'domestic violence';
    }
  }

  createForm() {
    this.contactForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      feedback: new FormControl('', [Validators.required]),
      phone: new FormControl('', []),
      topic: new FormControl('', [])
    });
  }

  // Convenience getter for easy access to form fields.
  get form() {
    return this.contactForm.controls;
  }

  contact() {
    this.isRequestInProgress = true;
    this.isSuccess = false;
    this.topics = this.getCheckedTopics();
    this.contactUsService
      .sendContactUsRequest(this.form.email.value, this.form.name.value, this.form.feedback.value, 'Contact Form', this.form.phone.value, this.topics)
      .subscribe((resp: any) => {
        this.isRequestInProgress = false;
        this.createForm();
        this.isSuccess = true;
      });
  }

  getCheckedTopics() {
    const checkedTopics = [];
    $.each($("input[name='topic']:checked"), function() {
      checkedTopics.push($(this).val());
    });

    return checkedTopics.join(', ');
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
    this.spinner.show();
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
      this.beginDivorceApplicationService.beginApplication('landing').subscribe(
        (client: Client) => {
          this.client = client;

          this.loadUpdates();
        },
        error => console.log(error)
      );
    }
  }

  goToAdminDashboard(userData) {
    if (this.authService.isLawyer()) {
      this.router.navigate(['a/l/dashboard']);
    } else {
      // const url = userData.forms['PRECHECK'].actionUrl.split('?');
      // const params = this.getQueryStringParams(url[1]);

      const params = { zip: '', haveDependents: 'N', shareTheCustody: 'N' };
      params['zip'] = this.zip ? this.zip : '';

      this.questionnaireService.updateResponse(userData.id, 'PRECHECK', { zip: this.zip }).subscribe((questionnaire: any) => {
        this.router.navigate(['/a/c/questionnaire', { qid: 'domestic_violence_diagnostics', source: 'domestic-violence' }]);
      });
    }
  }

  onCheckboxChange(e) {
    this[e.target.name] = e.target.checked;
  }

  onZipChange(e) {
    this.zip = e.target.value;
  }

  getQueryStringParams(query) {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
          const [key, value] = param.split('=');
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {})
      : {};
  }

  loadUpdates() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.data = data;
        setTimeout(() => {
          this.precheckCompleted = data.precheck_completed;
        });

        this.goToAdminDashboard(this.data);
      },
      error => {
        console.log(error);
      }
    );
  }

  onCtaClick(plan) {
    this.beginDivorceApplicationService.beginApplication('landing').subscribe((client: Client) => {
      this.router.navigate(['/a/c/checkout/lawyers', { plan: plan['id'] }]);
    });
  }

  onDiagnosticData(data) {
    const diagnosticData = {
      zip: data.zip
    };

    this.beginDivorceApplicationService.beginApplication('landing').subscribe((client: Client) => {
      this.questionnaireService.updateResponse(client.id, 'PRECHECK', diagnosticData).subscribe((questionnaire: any) => {
        this.router.navigate(['/a/c/questionnaire', { qid: 'domestic_violence_diagnostics', source: 'domestic-violence' }]);
      });
    });
  }
}
