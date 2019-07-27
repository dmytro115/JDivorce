import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-jd-questionnaire-input',
  templateUrl: './jd-questionnaire-input.component.html',
  styleUrls: ['./jd-questionnaire-input.component.scss']
})
export class JDQuestionnaireInputComponent implements OnInit {
  @Input() hasError = false;
  @Input() error = '';
  @Input() value = '';
  @Input() style = '';
  @Input() placeholder = 'Type your answer here...';
  @Input() maxLength = 400;
  @Output() answerChange = new EventEmitter();

  // tslint:disable-next-line: no-empty
  constructor() {}

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {}

  handleUndefined(value: string): string {
    if (value == undefined || value == 'undefined' || value == undefined || value == 'null') {
      return '';
    } else {
      return value;
    }
  }
}
