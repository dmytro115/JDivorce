import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LawyerRecommendationService, MixpanelService, SharedPlanService } from '../../../../core';
import { DashboardNavigationService } from '../../services/dashboard-navigation.service';
import { DashboardSharedService } from '../../services/dashboard-shared.service';
import { SpinnerService } from '../../services/spinner.service';
import { DashboardTabComponent } from '../dashboard-tab/dashboard-tab.component';
import { AnalysisService } from './analysis.service';
import { Recommendation } from './recommendation.interface';

@Component({
  selector: 'app-dashboard-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent extends DashboardTabComponent implements OnInit {
  recommendations: Array<Recommendation> = [];
  recommendedPlan: any;
  isLoadingRecommendations = true;
  isLoadingPlan = true;
  isLoading = true;
  pricingBlockCtaButtonOptions = {
    enabled: true,
    text: 'Select'
  };
  highlightPlanIds: Array<number> = [];
  inputPlans = [];
  isDivorce = true;

  dvRecommendations: any = undefined;

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly router: Router,
    private readonly analysisService: AnalysisService,
    private readonly lawyerRecommendationService: LawyerRecommendationService,
    private readonly dashboardNavigationSerivce: DashboardNavigationService,
    private readonly dashboardSharedService: DashboardSharedService,
    private readonly sharedPlanService: SharedPlanService,
    mixpanelService: MixpanelService
  ) {
    super(mixpanelService);
  }

  onInit(): void {
    this.spinnerService.isLoading({ isLoading: true, isLoadingText: 'Analyzing your diagnostics...' });
    this.isLoadingRecommendations = true;
    this.isLoading = true;
    this.isDivorce = this.dashboardSharedService.workflowType === 'DivorceWorkflow';
    this.lawyerRecommendationService.show(this.dashboardSharedService.workflowType, 'diagnostics').subscribe((recommendations: Array<Recommendation>) => {
      if (this.isDivorce) {
        // We only show the first 5 recommendations because the list can be very long.
        // TODO: Implement "load more" functionality or something similar.
        this.recommendations = recommendations.slice(0, 5);
      } else {
        this.dvRecommendations = recommendations;
      }
      this.isLoadingRecommendations = false;
      this.spinnerService.isLoading({ isLoading: false, isLoadingText: '' });
    });

    this.isLoadingPlan = true;
    this.lawyerRecommendationService.plan(this.dashboardSharedService.workflowType, 'diagnostics').subscribe((plans: any) => {
      if (plans) {
        this.inputPlans = plans;
        this.recommendedPlan = plans.find((plan: any) => plan.highlight);
        if (this.recommendedPlan) {
          this.sharedPlanService.setPlanId(this.recommendedPlan.id);
          this.highlightPlanIds.push(this.recommendedPlan.id);
        }
      }
      this.isLoadingPlan = false;
      this.spinnerService.isLoading({ isLoading: false, isLoadingText: '' });
    });
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

  onCtaClick(plan: any): void {
    if (plan.id === 0) {
      this.proceedWithoutLawyer();
    } else {
      this.router.navigate(['/a/c/checkout/lawyers', { plan: plan.id }]);
    }
  }
}
