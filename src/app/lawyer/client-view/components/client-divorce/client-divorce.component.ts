import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ClientService } from '../../../../core';
import { WorkflowType } from '../../../../core/models/workflow-type.model';
import { QuestionnaireService } from '../../../../modules/jd-questionnaire/jd-questionnaire.service';
import { staggerAnimation } from '../../../../shared/animations';

@Component({
  selector: 'app-client-divorce',
  templateUrl: './client-divorce.component.html',
  styleUrls: ['./client-divorce.component.scss'],
  animations: [staggerAnimation]
})
export class ClientDivorceComponent implements OnInit {
  questionnaires: any = [];
  documents: any = [];

  constructor(
    private readonly clientService: ClientService,
    private readonly questionnaireService: QuestionnaireService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.questionnaireService.fetchAll(this.authService.getClientId(), WorkflowType.DIVORCE).subscribe((questionnaires: any) => {
      this.questionnaires = questionnaires;
      this.clientService.getAndUpdateLs().subscribe(
        data => {
          const firstStage = data.forms_list_first_stage;
          Object.keys(firstStage).forEach(id => {
            this.questionnaires.push(firstStage[id]);
          });
          const secondStage = data.forms_list_second_stage;
          Object.keys(secondStage).forEach(id => {
            this.questionnaires.push(secondStage[id]);
          });

          if (data.google_documents) {
            this.documents = data.google_documents;
          }
          if (data.google_documents_stage_2) {
            this.documents = this.documents.concat(data.google_documents_stage_2);
          }
          /*
          this.documents = [
            { title: 'test doc 1', url: 'https://jdivorce.com/edit?usp-drivesdk' },
            { title: 'test doc 1', url: 'https://jdivorce.com/edit?usp-drivesdk' },
            { title: 'test doc 1', url: 'https://jdivorce.com/edit?usp-drivesdk' },
            { title: 'test doc 1', url: 'https://jdivorce.com/edit?usp-drivesdk' },
            { title: 'test doc 1', url: 'https://jdivorce.com/edit?usp-drivesdk' }
          ];
          */
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  formStatusText(questionnaire: { form_status: string; status: string }): string {
    if (questionnaire.form_status === 'EDIT' || questionnaire.status === 'COMPLETED') {
      return 'Complete';
      
    } else if (questionnaire.form_status === 'IN_PROGRESS') {
      return 'In Progress';
    } else {
      return 'Not Started';
    }
  }

  enableEditButton(questionnaire): boolean {
    return questionnaire.qid === 'PRECHECK';
  }

  goToQuestionnaire(questionnaire: any): void {
    if (questionnaire.qid === 'PRECHECK') {
      this.router.navigate([
        `/a/l/clients/${this.authService.getClientId()}/questionnaire`,
        { qid: questionnaire.qid.toLowerCase(), source: WorkflowType.DIVORCE_FRAGMENT, view: 'compact' }
      ]);
    }
  }
}
