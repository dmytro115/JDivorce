import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-jd-questionnaire-weight',
  templateUrl: './jd-questionnaire-weight.component.html',
  styleUrls: ['./jd-questionnaire-weight.component.scss']
})
export class JDQuestionnaireWeightComponent implements OnInit {
  @Input() hasError = false;
  @Input() error = '';
  @Input() value = 0;
  @Input() style = '';
  @Input() placeholder = 'The weight in lbs...';
  @Output() answerChange = new EventEmitter();

  // tslint:disable-next-line: no-empty
  constructor() {}

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {}

  handleUndefined(value: any): string {
    if (value === undefined || value === 'undefined' || value === undefined || value === 'null') {
      return '';
    } else {
      return value;
    }
  }
}
