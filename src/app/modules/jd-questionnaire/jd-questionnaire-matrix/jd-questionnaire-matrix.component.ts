import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-matrix',
  templateUrl: './jd-questionnaire-matrix.component.html',
  styleUrls: ['./jd-questionnaire-matrix.component.scss']
})
export class JDQuestionnaireMatrixComponent implements OnInit {
  @Input()
  hasError: boolean = false;
  @Input()
  errors: any = [];
  @Input()
  errorPos: any = {};
  @Input()
  value: any = [];
  @Input()
  options: any = [];
  @Output()
  onAnswer = new EventEmitter();

  activeIndex: any = { first: 0, second: 0 };
  constructor() { }

  ngOnInit() {
    if (!Array.isArray(this.value)) {
      this.value = [];
    }
    if (!this.value || this.value.length == 0 ) {
      this.add(0);
    }
  }

  getValue(index, name): any {
    return this.value[index][name] ? this.value[index][name] : null;
  }

  getError(index, name) {
    if (this.errorPos[index]) {
      if (this.errorPos[index].indexOf(name) !== -1) {
        return true;
      }
    }

    return false;
  }

  onAnswerChange(value, index, name) {
    this.value[index][name] = value;
    this.onAnswer.emit(this.value);
  }

  onDelete(event, rowIndex) {
    event.preventDefault();
    event.stopPropagation();
    this.initActiveIndex();

    this.value.splice(rowIndex, 1);
    if (this.value.length == 0) {
      this.add(0);
    }
    this.onAnswer.emit(this.value);
  }

  onCopy(event, rowIndex) {
    let copiedRow = JSON.parse(JSON.stringify(this.value[rowIndex]));
    event.preventDefault();
    event.stopPropagation();
    this.initActiveIndex();

    this.value.splice(rowIndex + 1, 0, copiedRow); 
  }

  onAdd(event) {
    event.preventDefault();
    event.stopPropagation();
    this.initActiveIndex();
    this.add(this.value.length);
  }

  add(rowIndex) {
    let fieldObj: any = {};

    this.options.forEach((option) => {
      fieldObj[option.name] = '';
    });

    this.initActiveIndex();
    this.value.splice(rowIndex, 0, fieldObj);
  }

  initActiveIndex() {
    this.activeIndex = {first: 0, second: 0};
  }

  getActive(index1, index2): boolean {
    return this.activeIndex.first == index1 && this.activeIndex.second == index2;
  }

  setActive(index1, index2) {
    this.activeIndex.first = index1;
    this.activeIndex.second = index2;
  }
}

