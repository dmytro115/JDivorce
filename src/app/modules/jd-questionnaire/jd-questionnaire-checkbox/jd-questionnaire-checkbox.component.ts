import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-checkbox',
  templateUrl: './jd-questionnaire-checkbox.component.html',
  styleUrls: ['./jd-questionnaire-checkbox.component.scss']
})
export class JDQuestionnaireCheckboxComponent implements OnInit, AfterViewInit {
  @Input()
  hasError: boolean = false;
  @Input()
  error: string = '';
  @Input()
  value: any = [];
  @Input()
  options: any[] = [];
  @Input()
  enableNoneOfTheAbove: any;
  @Input()
  enableOther: any;
  @Output()
  onAnswer = new EventEmitter();
  @ViewChild("other") otherInputField: ElementRef;

  constructor() { }

  ngOnInit() {
    if (this.enableOther) {
      this.options.push({
        label: 'Other',
        inputValue: '',
        canEdit: false,
        value: -2
      });
    }

    if (this.enableNoneOfTheAbove) {
      this.options.push({
        label: 'None of the above',
        value: -1
      })
    }
  }

  ngAfterViewInit() { }

  onSelect(option) {
    const selected = [...this.value];
    const value = option.value;
    if (value === -1) {
      selected.splice(0, selected.length);
      selected.push(-1);
    } else {
      if (selected.includes(-1)) {
        selected.splice(selected.indexOf(-1), 1);
      }
      if (selected.includes(value)) {
        if (value === -2 && option.canEdit) {
          return ;
        }
        selected.splice(selected.indexOf(value), 1);
      } else {
        if (value === -2) {
          option.canEdit = true;
          setTimeout(() => {
            this.otherInputField.nativeElement.focus();
          }, 500);
        }
        selected.push(value);
      }
    }
    this.onAnswer.emit(selected);
  }

  onBlurOtherInput(option) {
    option.canEdit = false;
    option.label = option.inputValue;

    if (!(option.label.trim())) {
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
