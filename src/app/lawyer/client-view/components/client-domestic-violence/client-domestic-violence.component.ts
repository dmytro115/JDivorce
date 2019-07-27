import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core';
import { WorkflowType } from '../../../../core/models/workflow-type.model';
import { Document, DocumentsService } from '../../../../core/services';
import { QuestionnaireService } from '../../../../modules/jd-questionnaire/jd-questionnaire.service';
import { staggerAnimation } from '../../../../shared/animations';

@Component({
  selector: 'app-client-domestic-violence',
  templateUrl: './client-domestic-violence.component.html',
  styleUrls: ['./client-domestic-violence.component.scss'],
  animations: [staggerAnimation]
})
export class ClientDomesticViolenceComponent implements OnInit {
  questionnaires: any = [];
  documents: any = [];

  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly authService: AuthService,
    private readonly documentsService: DocumentsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.questionnaireService.fetchAll(this.authService.getClientId(), WorkflowType.DOMESTIC_VIOLENCE).subscribe((questionnaires: any) => {
      this.questionnaireService.show(this.authService.getClientId(), WorkflowType.DOMESTIC_VIOLENCE, 'diagnostics').subscribe((diagnostics: any) => {
        this.questionnaires = diagnostics.concat(questionnaires);
      });
    });

    this.documentsService.list(WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT).subscribe((response: any) => {
      this.documents = response.documents;
    });
  }

  formStatusText(questionnaire: any): string {
    switch (questionnaire.status) {
      case 'COMPLETED': {
        return 'Completed';
      }
      case 'IN_PROGRESS': {
        return 'In Progress';
      }
      case 'NOT_STARTED': {
        return 'Not Started';
      }
      default: {
        return 'Not Started';
      }
    }
  }

  retrieveDocument(id: string, type: string): void {
    this.documentsService.show(id, type).subscribe((document: Document) => {
      window.open(document[`${type}_url`], '_blank');
    });
  }

  goToQuestionnaire(questionnaire: any): void {
    this.router.navigate([
      `/a/l/clients/${this.authService.getClientId()}/questionnaire`,
      { qid: questionnaire.qid.toLowerCase(), source: WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT }
    ]);
  }
}
