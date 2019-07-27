import { Component, Input } from '@angular/core';
import { DashboardNavigationService } from '../../services/dashboard-navigation.service';
import { DashboardSharedService } from '../../services/dashboard-shared.service';
import { AnalysisService } from '../analysis/analysis.service';

@Component({
  selector: 'app-domestic-violence-analysis',
  templateUrl: './domestic-violence-analysis.component.html',
  styleUrls: ['./domestic-violence-analysis.component.scss']
})
export class DomesticViolenceAnalysisComponent {
  @Input() dvRecommendations: any;

  constructor(
    private readonly dashboardNavigationSerivce: DashboardNavigationService,
    private readonly dashboardSharedService: DashboardSharedService,
    private readonly analysisService: AnalysisService
  ) {}

  eligibleHeader(): string {
    if (this.dvRecommendations.fact === 'ELIGIBLE') {
      return 'ELIGIBLE';
    } else {
      return 'NOT ELIGIBLE';
    }
  }

  onGoingCase(): string {
    if (this.dvRecommendations.justification.ongoing_case) {
      return 'cancel';
    } else {
      return 'check_circle_outline';
    }
  }

  respondentStatus(): string {
    if (this.dvRecommendations.justification.respondent_status) {
      return 'check_circle_outline';
    } else {
      return 'cancel';
    }
  }

  protections(): string {
    if (this.dvRecommendations.justification.protections.value) {
      return 'check_circle_outline';
    } else {
      return 'cancel';
    }
  }

  isCreateApplication(): boolean {
    return this.dvRecommendations.justification.options.includes('create_application');
  }

  isContactLawyerEligible(): boolean {
    return this.dvRecommendations.justification.options.includes('contact_a_lawyer_eligible');
  }

  isSexualAssault(): boolean {
    return this.dvRecommendations.justification.options.includes('contact_court_sexual_assault_protection_order');
  }

  isAntiharrassment(): boolean {
    return this.dvRecommendations.justification.options.includes('anti_harrassment');
  }

  isStalking(): boolean {
    return this.dvRecommendations.justification.options.includes('contact_court_stalking_order');
  }

  isAntiharrassmentContact(): boolean {
    return this.dvRecommendations.justification.options.includes('contact_court_anti_harrassment');
  }

  isContactLawyer(): boolean {
    return this.dvRecommendations.justification.options.includes('contact_a_lawyer');
  }

  isDivorceAndRestraining(): boolean {
    return this.dvRecommendations.justification.options.includes('create_divorce_and_restraining');
  }

  proceedWithoutLawyer(): void {
    this.analysisService.completeAnalysis(this.dashboardSharedService.workflowType).subscribe((response: boolean) => {
      if (response) {
        this.dashboardNavigationSerivce.goToNextTab();
      } else {
        // PNotify;
      }
    });
  }
}
