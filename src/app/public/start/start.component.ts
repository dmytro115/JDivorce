import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, PNotifyService } from '../../core';
import { WorkflowType } from '../../core/models/workflow-type.model';
import { QuestionnaireService } from '../../modules/jd-questionnaire/jd-questionnaire.service';
import { StartService } from './start.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  pnotify: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly startService: StartService,
    private readonly questionnaireService: QuestionnaireService,
    pnotifyService: PNotifyService
  ) {
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    this.subscribeToParams();
  }

  private subscribeToParams(): void {
    this.route.queryParams.subscribe(params => {
      const workflowType = params['workflowType'];
      const zip = params['zip'];
      const isChildren = params['isChildren'];
      const isAgreeOnSplit = params['isAgreeOnSplit'];
      const isAgreeOnCustody = params['isAgreeOnCustody'];

      if (workflowType === WorkflowType.DIVORCE.toString()) {
        const diagnosticData = {
          zip,
          have_dependents: isChildren,
          agree_divide: isAgreeOnSplit,
          agree_divide_custody: isAgreeOnCustody
        };

        // If there is no zip, then we start as a guest without going through the mini-diagnostics.
        if (zip) {
          this.startService.beginAsGuest().subscribe((client: Client) => {
            this.questionnaireService.updateResponse(client.id, 'PRECHECK', diagnosticData).subscribe((questionnaire: any) => {
              this.router.navigate(['/a/c/questionnaire', { qid: 'precheck', source: WorkflowType.DIVORCE_FRAGMENT, diagnostics: true }]);
            });
          });
        } else {
          this.startService.beginAsGuest().subscribe((client: Client) => {
            this.router.navigate(['/a/c/questionnaire', { qid: 'precheck', source: WorkflowType.DIVORCE_FRAGMENT }]);
          });
        }
      } else if (workflowType === WorkflowType.DOMESTIC_VIOLENCE.toString()) {
        this.startService.beginAsGuest().subscribe((client: Client) => {
          this.router.navigate(['/a/c/questionnaire', { qid: 'domestic_violence_diagnostics', source: WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT }]);
        });
      } else {
        this.pnotify.error({
          title: 'Oops!',
          text: "This isn't a valid page. Taking you back to your home page now!"
        });
        this.router.navigate(['/']);
      }
    });
  }
}
