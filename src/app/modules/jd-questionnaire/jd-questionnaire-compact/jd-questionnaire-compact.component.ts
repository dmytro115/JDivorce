import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './models/question-base';
import { QuestionControlService } from './services/question-control.service';

@Component({
  selector: 'app-jd-questionnaire-compact',
  templateUrl: './jd-questionnaire-compact.component.html',
  styleUrls: ['./jd-questionnaire-compact.component.scss']
})
export class JdQuestionnaireCompactComponent implements OnInit {
  @Input() questions: Array<QuestionBase<any>> = [];
  @Output() saveQuestionnaire = new EventEmitter();
  questionnaireForm: FormGroup;

  constructor(private readonly qcs: QuestionControlService) {}

  ngOnInit(): void {
    this.questions = this.qcs.buildQuestionBaseArray(this.questions);
    this.questionnaireForm = this.qcs.toFormGroup(this.questions);
  }

  onSubmit(): void {
    this.saveQuestionnaire.emit(this.questionnaireForm.value);
  }
}
