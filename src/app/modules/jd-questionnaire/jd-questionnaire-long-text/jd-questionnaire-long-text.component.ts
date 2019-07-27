import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { EventEmitter, ViewChild } from '@angular/core';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-long-text',
  templateUrl: './jd-questionnaire-long-text.component.html',
  styleUrls: ['./jd-questionnaire-long-text.component.scss']
})
export class JdQuestionnaireLongTextComponent implements OnInit {
	@Input()
	hasError: boolean = false;
	@Input()
	error: string = '';
	@Input()
	value: string = '';
	@Input()
	placeholder: string = 'Type your answer here...';
	@Output()
	onAnswer = new EventEmitter();
	@Output()
	onEnter = new EventEmitter();

  @ViewChild('autosize') autosize : CdkTextareaAutosize;

  constructor() { }

  ngOnInit() { }

  countRowsInText(value) {
    if (!value) {
      return 1;
    }
    return value.split('\n').length;
  }

  onKeyDownEnter(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.onEnter.emit(event);
    }
  }

  handleUndefined(value: string): string {
    
    if (value == undefined || value == 'undefined' || value == null || value == 'null') {
      return '';
    } else {
      
      return value;
    }

  }
}
