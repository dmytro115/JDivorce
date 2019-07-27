import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { DashboardAppComponent } from '../../../dashboard/components/dashboard-app/dashboard-app.component';
import { DashboardTab } from '../../../dashboard/models/dashboard-tab.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { DashboardSharedService } from '../../../dashboard/services/dashboard-shared.service';
import { WorkflowService } from '../../../dashboard/services/workflow.service';

@Component({
  selector: 'app-divorce-dashboard',
  templateUrl: './divorce-dashboard.component.html',
  styleUrls: ['./divorce-dashboard.component.scss']
})
export class DivorceDashboardComponent implements OnInit {
  private static WORKFLOW_TYPE: string = 'DivorceWorkflow';
  private static URL_FRAGMENT: string = 'divorce';

  tabs: DashboardTab[] = [
    new DashboardTab('diagnostics',            'Diagnostics', false, false, false),
    new DashboardTab('analysis',               'Analysis', false, false, false),
    new DashboardTab('case-info',              'Case Info', false, false, false),
    new DashboardTab('filing-documents',       'Filing Documents', false, false, false),
    new DashboardTab('finalization',           'Finalization', false, false, false),
    new DashboardTab('finalization-documents', 'Finalization Documents', false, false, false)
  ];

  private static ENABLED_STATE_MAP: any = {
    'diagnostics':            [true, false, false, false, false, false],
    'analysis':               [true, true, false, false, false, false],
    'case_info':              [true, true, true, false, false, false],
    'filing_documents':       [true, true, true, true, false, false],
    'finalization':           [true, true, true, true, true, false],
    'finalization_documents': [true, true, true, true, true, true]
  }

  private static COMPLETED_STATE_MAP: any = {
    'diagnostics':            [false, false, false, false, false, false],
    'analysis':               [true, false, false, false, false, false],
    'case_info':              [true, true, false, false, false, false],
    'filing_documents':       [true, true, true, false, false, false],
    'finalization':           [true, true, true, true, false, false],
    'finalization_documents': [true, true, true, true, true, false]
  }

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private dashboardSharedService: DashboardSharedService,
    private authService: AuthService) { }

  ngOnInit() {
    this.dashboardSharedService.urlFragment = this.urlFragment;
    this.dashboardSharedService.workflowType = DivorceDashboardComponent.WORKFLOW_TYPE;
  }

  get workflowType() {
    return DivorceDashboardComponent.WORKFLOW_TYPE;
  }

  get urlFragment() {
    return DivorceDashboardComponent.URL_FRAGMENT;
  }

  get enabledStateMap() {
    return DivorceDashboardComponent.ENABLED_STATE_MAP;
  }

  get completedStateMap() {
    return DivorceDashboardComponent.COMPLETED_STATE_MAP;
  }
}
