import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-statement',
  templateUrl: './jd-questionnaire-statement.component.html',
  styleUrls: ['./jd-questionnaire-statement.component.scss']
})
export class JDQuestionnaireStatementComponent implements OnInit {
  @Input()
  value: string = '';
  
  constructor() { }

  ngOnInit() {
  }

}
