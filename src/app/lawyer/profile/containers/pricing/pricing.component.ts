import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LawyerProfileService } from '../../../../core/lawyer/lawyer-profile.service';
import { ProfessionalProfile } from '../../../../core/lawyer/professional-profile.interface';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  isCompleted = false;
  isLoading = false;
  isFailed = false;
  qid: any;
  status: string;
  questions: Array<any> = [];
  continueButtonUrl: string;
  defaultPlans: Array<any> = [];
  questionnaireView: string = 'verbose';

  constructor(private readonly router: Router, private readonly professionalProfileService: LawyerProfileService) {}

  ngOnInit(): void {
    this.setupQuestionnaire();
    this.professionalProfileService.showDefaultPlans().subscribe((plans: Array<any>) => {
      this.defaultPlans = plans;
    });
  }

  onSubmit(result: any): void {
    this.isLoading = true;
    this.professionalProfileService.updatePlans(result).subscribe((response: ProfessionalProfile) => {
      this.isLoading = false;
      if (response) {
        this.isCompleted = true;
        this.router.navigate(['/a/l/profile/calendar']);
      } else {
        this.isFailed = true;
      }
    });
  }

  setupQuestionnaire(): void {
    this.professionalProfileService.showPlanQuestionnaireDefinition().subscribe((definition: any) => {
      this.questions = definition.questions;
      this.qid = definition.qid;
    });
  }
}
