import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthDialogService, AuthService } from '../../../../core';
import { DashboardNavigationService } from '../../../dashboard/services/dashboard-navigation.service';
import { WorkflowService } from '../../../dashboard/services/workflow.service';
import { DashboardTab } from '../../models/dashboard-tab.model';

@Component({
  selector: 'app-dashboard-app',
  templateUrl: './dashboard-app.component.html',
  styleUrls: ['./dashboard-app.component.scss']
})
export class DashboardAppComponent implements OnInit, OnDestroy {
  @Input() tabs: Array<DashboardTab>;
  @Input() enabledStateMap: any;
  @Input() completedStateMap: any;
  @Input() workflowType: string;
  @Input() urlFragment: string;
  isSubmit = false;

  private routerEventSubscription: Subscription;
  // https://blog.angularindepth.com/the-best-way-to-unsubscribe-rxjs-observable-in-the-angular-applications-d8f9aa42f6a0
  private readonly unsubscribeDashboardNavigationService$ = new Subject<any>();

  constructor(
    private readonly authService: AuthService,
    private readonly authDialogService: AuthDialogService,
    private readonly workflowService: WorkflowService,
    private readonly dashboardNavigationService: DashboardNavigationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const urlParts = this.router.url.split('/');
    const foundTab = this.routeInTabs(urlParts[urlParts.length - 1]);
    this.evaluateTabs(foundTab);
    this.evaluateTabsOnRouteEvents();
    this.dashboardNavigationService.nextTab$.pipe(takeUntil(this.unsubscribeDashboardNavigationService$)).subscribe(() => {
      this.evaluateTabs();
    });
  }

  evaluateTabsOnRouteEvents(): void {
    this.routerEventSubscription = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        if (event.url) {
          const urlParts = event.url.split('/');
          const childTab = urlParts[urlParts.length - 1];
          const foundTab = this.routeInTabs(childTab);
          if (foundTab || childTab === this.urlFragment) {
            this.evaluateTabs(foundTab);
          }
        }
      }
    });
  }

  evaluateTabs(targetTab?: DashboardTab): void {
    this.workflowService.retrieve(this.authService.getCurrentUser().id, this.workflowType).subscribe(workflow => {
      const enabledTabs = this.enabledStateMap[workflow.current_state];
      const completedTabs = this.completedStateMap[workflow.current_state];
      let lastCompletedIndex = -1;
      this.tabs.forEach((tab: DashboardTab, index: number) => {
        tab.isEnabled = enabledTabs[index];
        tab.isCompleted = completedTabs[index];
        tab.isActive = false;
        if (tab.isCompleted) {
          lastCompletedIndex = index;
        }
      });
      if (targetTab && targetTab.isEnabled) {
        targetTab.isActive = true;
      } else {
        const defaultTab: DashboardTab = this.tabs[Math.min(lastCompletedIndex + 1, this.tabs.length - 1)];
        defaultTab.isActive = true;
        this.route.params.subscribe((params: any) => {
          if (params.submit === 'true') {
            this.isSubmit = true;
          }
        });
        this.router.navigate([['a', 'c', this.urlFragment, defaultTab.id].join('/')]);
      }
    });

    // Use setTimeout here, otherwise it throws an ExpressionChangedAfterItHasBeenCheckedError error.
    setTimeout(() => {
      // This relies on the timeout coming AFTER evaluating tabs is finished setting isSubmit to true.
      if (this.authService.isGuest() && this.isSubmit) {
        this.isSubmit = false;
        this.authDialogService.openSignupDialog({
          hideLawyerSignup: true,
          hideLogin: true,
          infoMessage:
            // tslint:disable-next-line: max-line-length
            "Hi! We noticed that you haven't registered with us yet. We  highly recommend that you register an account so that we can make sure you don't lose any of your progress."
        });
      }
    }, 3000);
  }

  routeInTabs(childTab: string): DashboardTab {
    return this.tabs.find(tab => tab.id === childTab);
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
    this.unsubscribeDashboardNavigationService$.next();
    this.unsubscribeDashboardNavigationService$.complete();
  }
}
