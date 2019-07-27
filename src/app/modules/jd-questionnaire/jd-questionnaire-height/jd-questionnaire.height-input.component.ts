import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-jd-questionnaire-height-input',
  templateUrl: './jd-questionnaire.height-input.component.html',
  styleUrls: ['./jd-questionnaire.height-input.component.scss']
})
export class JDQuestionnaireHeightInputComponent implements OnInit {
  @Input() hasError = false;
  @Input() error = '';
  @Input() value: { feet: 0; inches: 0 };
  @Input() style = '';
  @Input() placeholder = 'Type your answer here...';
  @Output() answerChange = new EventEmitter();

  @ViewChild('feet') feet: ElementRef;
  @ViewChild('inches') inches: ElementRef;

  // tslint:disable-next-line: no-empty
  constructor() {}

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {}

  handleUndefined(value: string): string {
    if (value === undefined || value === 'undefined' || value === undefined || value === 'null') {
      return '';
    } else {
      return value;
    }
  }

  onInput(value): void {
    this.value = { feet: this.feet.nativeElement.value, inches: this.inches.nativeElement.value };
    this.answerChange.emit(this.value);
  }
}
