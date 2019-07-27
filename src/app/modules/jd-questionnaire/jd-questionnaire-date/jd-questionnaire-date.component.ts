import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-date',
  templateUrl: './jd-questionnaire-date.component.html',
  styleUrls: ['./jd-questionnaire-date.component.scss']
})
export class JDQuestionnaireDateComponent implements OnInit {
  @Input()
  hasError: boolean = false;
  @Input()
  error: string = '';
  @Input()
  value: string = '';
  @Input()
  style: string = "";
  @Output()
  onAnswer = new EventEmitter();
  @ViewChild('main') mainInputField: ElementRef;

  private regex = new RegExp(/^\d+$/);
  private setting = {
    month: {
      default: 'MM',
      rangeStart: 0,
      rangeEnd: 3,
      length: 2,
      value: -1,
      isNew: true
    },
    day: {
      default: 'DD',
      rangeStart: 4,
      rangeEnd: 8,
      length: 2,
      value: -1,
      isNew: true
    },
    year: {
      default: 'YYYY',
      rangeStart: 9,
      rangeEnd: 14,
      length: 4,
      value: -1,
      isNew: true
    }
  }
  private arrowVer = {ArrowLeft: -1, ArrowRight: 1};
  private arrowHor = {ArrowDown: -1, ArrowUp: 1};
  private keyArrays = ['month', 'day', 'year'];
  private monthDays = {
    0: 31, 1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
  };

  constructor() {
  }

  ngOnInit() {
    if (this.value) {
      let givenDayObj = new Date(+this.value * 1000);

      if (givenDayObj) {
        if (givenDayObj.getDate()) {
          this.setting.day.value = givenDayObj.getDate();
          this.setting.month.value = givenDayObj.getMonth() + 1;
          this.setting.year.value = givenDayObj.getFullYear();
        }
      }
    }

    this.mainInputField.nativeElement.value = this.genValue();
  }

  onBlur(event) {
    if (this.setting.year.value != -1 && this.setting.month.value != -1 && this.setting.day.value != -1) {
      let date = new Date(this.setting.year.value, this.setting.month.value - 1, this.setting.day.value);
      this.onAnswer.emit(Math.floor(date.getTime() / 1000));
    } else {
      this.onAnswer.emit(0);
    }
  }

  onKeyDown(event) {
    let keyCode = event.key;
    let todayObj = new Date();
    let today = {
      month: todayObj.getMonth() + 1,
      day: todayObj.getDate(),
      year: todayObj.getFullYear()
    };
    let selKey = this.getDateType(0);

    if (keyCode == 'Tab') {
      if (selKey == 'year') {
      } else {
        event.preventDefault();
        selKey = this.getDateType(1);
      }
    } else {
      event.preventDefault();
    }

    if (keyCode == 'Backspace') {
      if (this.setting[selKey].value == -1) {
        selKey = this.getDateType(-1);
      } else {
        this.setting[selKey].value = -1;
      }
    }

    if (this.arrowHor[keyCode]) {
      if (this.setting[selKey].value === -1) {
        this.setting[selKey].value = today[selKey];
      } else {
        this.setting[selKey].value += this.arrowHor[keyCode];

        if (this.setting[selKey].value === 0 && keyCode == 'ArrowDown') {
          let temp;
          if (selKey == 'month') {
            temp = 12;
          } else if (selKey == 'day') {
            if (this.setting.month.value == 2 && this.setting.year.value % 4 == 0) {
              temp = 29;
            } else {
              temp = this.monthDays[this.setting.month.value];
            }
          } else {
            temp = 9999;
          }

          this.setting[selKey].value = temp;
        }
      }
    }

    if (keyCode.match(this.regex)) {
      keyCode = +keyCode;
      if (selKey == 'year') {
        if (this.setting.year.value == -1) {
          this.setting.year.value = keyCode;
        } else {
          this.setting.year.value = this.setting.year.value * 10 + keyCode;
          if (this.setting.year.value >= 10000) {
            this.setting.year.value = this.setting.year.value % 10000;

            if (this.setting.year.value == 0) {
              this.setting.year.value = 1;
            }
          }
        }
      } else {
        if (this.setting[selKey].isNew) {
          this.setting[selKey].value = keyCode;
          this.setting[selKey].isNew = true;

          if (selKey == 'month' && keyCode > 1) {
            selKey = this.getDateType(1);
          } else if (selKey == 'day' && ((keyCode > 2 && this.setting.month.value == 2) || keyCode > 3)) {
            selKey = this.getDateType(1);
          } else {
            this.setting[selKey].isNew = false;
          }
        } else {
          if (selKey == 'month') {
            this.setting.month.value = 10 * this.setting.month.value + keyCode;
            this.setting[selKey].isNew = true;
            if (this.setting.month.value == 0) {
              this.setting.month.value = 1;
            } else if (this.setting.month.value > 12) {
              this.setting.month.value = 12;
            }
            selKey = this.getDateType(1);
          } else if (selKey == 'day') {
            let monthDayLimit = this.monthDays[this.setting.month.value];

            if (this.setting.month.value == 2 && this.setting.year.value % 4 == 0) {
              monthDayLimit++;
            }

            this.setting.day.value = 10 * this.setting.day.value + keyCode;
            this.setting[selKey].isNew = true;

            if (this.setting.day.value == 0) {
              this.setting.day.value = 1;
            } else if (this.setting.day.value > monthDayLimit) {
              this.setting.day.value = monthDayLimit;
            }
            selKey = this.getDateType(1);
          }
        }
      }
    }

    if (this.arrowVer[keyCode]) {
      this.selectRange(this.getDateType(this.arrowVer[keyCode]));
    } else {
      this.mainInputField.nativeElement.value = this.genValue();
      this.selectRange(selKey);
    }
  }

  onMouseClick(event) {
    this.selectRange(-1);
  }

  selectRange(key) {
    let selectedKey = key;

    if (selectedKey === -1) {
      selectedKey = this.getDateType(0);
    }

    let rangeStart = this.setting[selectedKey].rangeStart + 1;
    let rangeLength = this.setting[selectedKey].length;

    if (rangeStart == 1) {
      rangeStart = 0;
    }

    this.mainInputField.nativeElement.setSelectionRange(rangeStart, rangeStart + rangeLength);
  }

  getDateType(type) {
    let selectionStart = this.mainInputField.nativeElement.selectionStart;
    let selectedKey = 'month';

    for (let dateTypeKey in this.setting) {
      let dateTypeObject = this.setting[dateTypeKey];

      if (dateTypeObject.rangeStart <= selectionStart && selectionStart <= dateTypeObject.rangeEnd) {
        selectedKey = dateTypeKey;
      }
    }

    if (type === this.arrowVer.ArrowRight) {
      selectedKey = this.keyArrays[Math.min(this.keyArrays.indexOf(selectedKey) + 1, 2)];
    } else if (type === this.arrowVer.ArrowLeft) {
      selectedKey = this.keyArrays[Math.max(this.keyArrays.indexOf(selectedKey) - 1, 0)];
    }

    return selectedKey;
  }

  genValue() {
    let result = '';
    let month = '';
    let day = '';
    let year = '';

    this.validateValue();

    if (this.setting.month.value < 10) {
      month = '0' + this.setting.month.value;
    } else {
      month = this.setting.month.value.toString();
    }

    if (this.setting.day.value < 10) {
      day = '0' + this.setting.day.value;
    } else {
      day = this.setting.day.value.toString();
    }

    if (this.setting.year.value < 10) {
      year = '000' + this.setting.year.value;
    } else if (this.setting.year.value < 100) {
      year = '00' + this.setting.year.value;
    } else if (this.setting.year.value < 1000) {
      year = '0' + this.setting.year.value;
    } else {
      year = this.setting.year.value.toString();
    }

    if (this.setting.month.value === -1) {
      month = this.setting.month.default;
    }

    if (this.setting.day.value === -1) {
      day = this.setting.day.default;
    }

    if (this.setting.year.value === -1) {
      year = this.setting.year.default;
    }

    result = month + ' / ' + day + ' / ' + year;

    return result;
  }

  validateValue() {
    let monthDayLimit = this.monthDays[this.setting.month.value];

    if (this.setting.month.value > 12) {
      this.setting.month.value = 1;
    }

    if (this.setting.month.value == 2 && this.setting.year.value % 4 == 0) {
      monthDayLimit++;
    }

    if (this.setting.day.value > monthDayLimit) {
      this.setting.day.value = 1;
    }
  }
}
