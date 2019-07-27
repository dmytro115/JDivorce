import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-radio',
  templateUrl: './jd-questionnaire-radio.component.html',
  styleUrls: ['./jd-questionnaire-radio.component.scss']
})
export class JDQuestionnaireRadioComponent implements OnInit {
  @Input()
  isBoolean: boolean = false;
  @Input()
  hasImage: boolean;
  @Input()
  hasError: boolean = false;
  @Input()
  error: string = '';
  @Input()
  value: any;
  @Input()
  options: any[] = [];
  @Input()
  enableOther: any;
  @Output()
  onAnswer = new EventEmitter();
  @ViewChild("other") otherInputField: ElementRef;
  @Input() question: any;

  constructor() { }

  ngOnInit() {
    // Initialize the options array in case null is passed in.
    // This can happen on purpose if the question type is a boolean and the default options will be initialized here.
    if (!this.options) {
      this.options = [];
    }

    if (this.isBoolean && this.options.length === 0) {
      this.options.push({
        label: 'Yes',
        value: 'true'
      }, {
        label: 'No',
        value: 'false'
      });
    }

    if (this.enableOther && !this.hasImage) {
      this.options.push({
        label: 'Other',
        inputValue: '',
        canEdit: false,
        value: -1
      });
    }
  }

  isSelected(selectedValue: any) {
    return selectedValue === this.value;
  }

  onSelect(option) {
    if (option.value === -1) {
      if (option.canEdit) {
        return;
      }
      
      option.canEdit = true;
      setTimeout(() => {
        this.otherInputField.nativeElement.focus();
      }, 500);
      if (this.isSelected(option.value)) {
        return;
      }
    }

    this.onAnswer.emit(option.value);
  }

  onBlurOtherInput(option) {
    option.canEdit = false;
    option.label = option.inputValue;

    if (!option.label.trim()) {
      option.label = "Other";
    }
  }

  countRowsInText(value) {
    if (!value) {
      return 1;
    }

    return value.split('\n').length;
  }
}
