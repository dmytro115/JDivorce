import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BeginDivorceApplicationService, Client, ContactUsService } from '../../core';
import { QuestionnaireService } from '../../modules/jd-questionnaire/jd-questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isVideoVisible = false;
  precheckCompleted = false;
  activeTab = 1;

  contactForm: FormGroup;
  alertText: string;
  isRequestInProgress = false;
  isSuccess = false;
  showQuestionTab = true;

  pricingBlockCtaButtonOptions = {
    enabled: true,
    text: 'Select'
  };
  plansFilter = [0, 1];

  constructor(
    private readonly router: Router,
    private readonly beginDivorceApplicationService: BeginDivorceApplicationService,
    private readonly formBuilder: FormBuilder,
    private readonly contactUsService: ContactUsService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.showQuestionTab = false;
  }

  createForm(): void {
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
    this.contactUsService
      .sendContactUsRequest(this.form.email.value, this.form.name.value, this.form.feedback.value, 'Contact Form', this.form.phone.value, '')
      .subscribe((resp: any) => {
        this.isRequestInProgress = false;
        this.createForm();
        this.isSuccess = true;
      });
  }

  changeTab(index: number): void {
    this.activeTab = index;
  }

  onVideoOpen(): void {
    this.isVideoVisible = true;
  }

  onVideoClose(): void {
    this.isVideoVisible = false;
  }

  onCtaClick(plan: any): void {
    if (plan.id === 0) {
      this.router.navigate(['a/c/questionnaire', { qid: 'precheck', source: 'divorce' , diagnostics: true }]);
    } else {
      this.beginDivorceApplicationService.beginApplication('landing').subscribe((client: Client) => {
        this.router.navigate(['/a/c/checkout/lawyers', { plan: plan['id'] }]);
      });
    }
  }

  onDiagnosticData(data: any): void {
    this.spinner.show();
    const diagnosticData = {
      zip: data.zip,
      have_dependents: this.convertInputToBooelanString(data.isChildren),
      agree_divide: this.convertInputToBooelanString(data.isAgreeOnSplit),
      agree_divide_custody: this.convertInputToBooelanString(data.isAgreeOnCustody)
    };
    this.beginDivorceApplicationService.beginApplication('landing').subscribe((client: Client) => {
      this.questionnaireService.updateResponse(client.id, 'PRECHECK', diagnosticData).subscribe((questionnaire: any) => {
      
        this.router.navigate(['a/c/questionnaire', { qid: 'precheck', source: 'divorce' , diagnostics: true }]);
       
      });
    });
  }

 

  private convertInputToBooelanString(input: any): string {
    if (input === '' || input === null || input === undefined) {
      return 'false';
    } else {
      return input.toString();
    }
  }
}
