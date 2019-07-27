import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardTab } from '../../../dashboard/models/dashboard-tab.model';
import { DashboardSharedService } from '../../../dashboard/services/dashboard-shared.service';

@Component({
  selector: 'app-domestic-violence-dashboard',
  templateUrl: './domestic-violence-dashboard.component.html',
  styleUrls: ['./domestic-violence-dashboard.component.scss']
})
export class DomesticViolenceDashboardComponent implements OnInit {
  private static readonly WORKFLOW_TYPE = 'DomesticViolenceWorkflow';
  private static readonly URL_FRAGMENT = 'domestic-violence';
  private static readonly ENABLED_STATE_MAP: any = {
    precheck: [true, false, false, false],
    analysis: [true, true, false, false],
    case_info: [true, true, true, false],
    download_documents: [true, true, true, true]
  };
  private static readonly COMPLETED_STATE_MAP: any = {
    precheck: [false, false, false, false],
    analysis: [true, false, false, false],
    case_info: [true, true, false, false],
    download_documents: [true, true, true, false]
  };

  tabs: Array<DashboardTab> = [
    new DashboardTab('diagnostics', 'QUESTIONNAIRES.NAMES.PRECHECK', false, false, false),
    new DashboardTab('analysis', 'TABS.ANALYSIS', false, false, false),
    new DashboardTab('case-info', 'TABS.FILING_SURVEY', false, false, false),
    new DashboardTab('documents', 'TABS.DOCUMENTS', false, false, false)
  ];

  constructor(public activatedRoute: ActivatedRoute, private readonly dashboardSharedService: DashboardSharedService) {}

  ngOnInit(): void {
    this.dashboardSharedService.urlFragment = this.urlFragment;
    this.dashboardSharedService.workflowType = DomesticViolenceDashboardComponent.WORKFLOW_TYPE;
  }

  get workflowType(): string {
    return DomesticViolenceDashboardComponent.WORKFLOW_TYPE;
  }

  get urlFragment(): string {
    return DomesticViolenceDashboardComponent.URL_FRAGMENT;
  }

  get enabledStateMap(): any {
    return DomesticViolenceDashboardComponent.ENABLED_STATE_MAP;
  }

  get completedStateMap(): any {
    return DomesticViolenceDashboardComponent.COMPLETED_STATE_MAP;
  }
}
